// Тесты сервера: проверка заявки, обязательное согласие, отправка в Telegram (подменена), 503 без env, лимит.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createApp } = require('../server/app');
const { validateRequest } = require('../server/validate');

const VALID = {
  name: 'Анна',
  phone: '+7 (921) 555-12-34',
  comment: 'Дом 150 м²',
  product: 'Blizzard L2',
  consent: true,
};
const ENV = { BOT_TOKEN: 'test-token', CHAT_ID: '-100123' };

function createLogger() {
  const lines = [];
  const write = (...parts) => lines.push(parts.join(' '));
  return { lines, info: write, warn: write, error: write, log: write };
}

function createFetchMock(status = 200) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return { ok: status >= 200 && status < 300, status, json: async () => ({ ok: status === 200 }) };
  };
  return { calls, fetchImpl };
}

async function startServer(options) {
  const app = createApp(options);
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (body) =>
    fetch(`${base}/api/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  const close = () => {
    app.locals.stopRateLimiter();
    return new Promise((resolve) => server.close(resolve));
  };
  return { base, post, close };
}

test('validateRequest: принимает корректную заявку и обрезает пробелы', () => {
  const result = validateRequest({ ...VALID, name: '  Анна  ' });
  assert.equal(result.ok, true);
  assert.equal(result.data.name, 'Анна');
});

test('validateRequest: согласие должно быть именно true', () => {
  for (const consent of [undefined, false, 'true', 'on', 1]) {
    assert.equal(validateRequest({ ...VALID, consent }).ok, false, String(consent));
  }
});

test('validateRequest: отклоняет плохие имя, телефон и длинный комментарий', () => {
  assert.equal(validateRequest({ ...VALID, name: 'А' }).ok, false);
  assert.equal(validateRequest({ ...VALID, phone: '12345' }).ok, false);
  assert.equal(validateRequest({ ...VALID, phone: 'позвоните мне' }).ok, false);
  assert.equal(validateRequest({ ...VALID, comment: 'x'.repeat(1001) }).ok, false);
  assert.equal(validateRequest(null).ok, false);
});

test('POST /api/request: отправляет заявку в Telegram и не пишет телефон в лог', async () => {
  const mock = createFetchMock();
  const logger = createLogger();
  const server = await startServer({ env: ENV, fetchImpl: mock.fetchImpl, logger });
  try {
    const response = await server.post(VALID);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(mock.calls.length, 1);
    assert.equal(mock.calls[0].url, 'https://api.telegram.org/bottest-token/sendMessage');
    assert.equal(mock.calls[0].body.chat_id, '-100123');
    assert.match(mock.calls[0].body.text, /Анна/);
    assert.match(mock.calls[0].body.text, /\+7 \(921\) 555-12-34/);
    assert.match(mock.calls[0].body.text, /Blizzard L2/);
    const logText = logger.lines.join('\n');
    assert.doesNotMatch(logText, /555/);
    assert.doesNotMatch(logText, /921/);
  } finally {
    await server.close();
  }
});

test('POST /api/request: без согласия — 400, Telegram не вызывается', async () => {
  const mock = createFetchMock();
  const server = await startServer({ env: ENV, fetchImpl: mock.fetchImpl, logger: createLogger() });
  try {
    const response = await server.post({ ...VALID, consent: false });
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /согласие/);
    assert.equal(mock.calls.length, 0);
  } finally {
    await server.close();
  }
});

test('POST /api/request: битый JSON — 400', async () => {
  const server = await startServer({ env: ENV, fetchImpl: createFetchMock().fetchImpl, logger: createLogger() });
  try {
    const response = await server.post('{"name":');
    assert.equal(response.status, 400);
  } finally {
    await server.close();
  }
});

test('POST /api/request: без BOT_TOKEN/CHAT_ID — 503 и запись в лог без телефона', async () => {
  const mock = createFetchMock();
  const logger = createLogger();
  const server = await startServer({ env: {}, fetchImpl: mock.fetchImpl, logger });
  try {
    const response = await server.post(VALID);
    assert.equal(response.status, 503);
    assert.equal(mock.calls.length, 0);
    assert.match(logger.lines.join('\n'), /BOT_TOKEN/);
    assert.doesNotMatch(logger.lines.join('\n'), /555/);
  } finally {
    await server.close();
  }
});

test('POST /api/request: ошибка Telegram — 502', async () => {
  const mock = createFetchMock(500);
  const logger = createLogger();
  const server = await startServer({ env: ENV, fetchImpl: mock.fetchImpl, logger });
  try {
    const response = await server.post(VALID);
    assert.equal(response.status, 502);
    assert.doesNotMatch(logger.lines.join('\n'), /555/);
  } finally {
    await server.close();
  }
});

test('POST /api/request: ограничение частоты — 429 после лимита', async () => {
  const mock = createFetchMock();
  const server = await startServer({
    env: ENV,
    fetchImpl: mock.fetchImpl,
    logger: createLogger(),
    rateLimit: { limit: 2, windowMs: 60000 },
  });
  try {
    assert.equal((await server.post(VALID)).status, 200);
    assert.equal((await server.post(VALID)).status, 200);
    const third = await server.post(VALID);
    assert.equal(third.status, 429);
    assert.ok(third.headers.get('retry-after'));
    assert.equal(mock.calls.length, 2);
  } finally {
    await server.close();
  }
});

test('сервер отдаёт собранные страницы и 404.html для неизвестных адресов', async () => {
  const distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blizzard-dist-'));
  fs.writeFileSync(path.join(distDir, 'index.html'), '<h1>Главная</h1>');
  fs.writeFileSync(path.join(distDir, '404.html'), '<h1>Не найдено</h1>');
  const server = await startServer({ env: ENV, distDir, logger: createLogger() });
  try {
    const home = await fetch(`${server.base}/`);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /Главная/);
    const missing = await fetch(`${server.base}/nope.html`);
    assert.equal(missing.status, 404);
    assert.match(await missing.text(), /Не найдено/);
  } finally {
    await server.close();
    fs.rmSync(distDir, { recursive: true, force: true });
  }
});
