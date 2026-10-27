// @vitest-environment node
// Тесты сервера: POST /api/request — согласие, отправка в Telegram (подменена), 503 без env, 502, лимит 429,
// раздача собранного сайта (страницы с .html и без, 404, долгий кеш для /assets).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SECURITY_HEADERS, createApp } from './app.js';

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

it('POST /api/request: отправляет заявку в Telegram и не пишет телефон в лог', async () => {
  const mock = createFetchMock();
  const logger = createLogger();
  const server = await startServer({ env: ENV, fetchImpl: mock.fetchImpl, logger });
  try {
    const response = await server.post(VALID);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0].url).toBe('https://api.telegram.org/bottest-token/sendMessage');
    expect(mock.calls[0].body.chat_id).toBe('-100123');
    expect(mock.calls[0].body.text).toMatch(/Анна/);
    expect(mock.calls[0].body.text).toMatch(/\+7 \(921\) 555-12-34/);
    expect(mock.calls[0].body.text).toMatch(/Blizzard L2/);
    const logText = logger.lines.join('\n');
    expect(logText).not.toMatch(/555/);
    expect(logText).not.toMatch(/921/);
  } finally {
    await server.close();
  }
});

it('POST /api/request: без согласия — 400, Telegram не вызывается', async () => {
  const mock = createFetchMock();
  const server = await startServer({ env: ENV, fetchImpl: mock.fetchImpl, logger: createLogger() });
  try {
    const response = await server.post({ ...VALID, consent: false });
    expect(response.status).toBe(400);
    expect((await response.json()).error).toMatch(/согласие/);
    expect(mock.calls.length).toBe(0);
  } finally {
    await server.close();
  }
});

it('POST /api/request: битый JSON — 400', async () => {
  const server = await startServer({ env: ENV, fetchImpl: createFetchMock().fetchImpl, logger: createLogger() });
  try {
    const response = await server.post('{"name":');
    expect(response.status).toBe(400);
  } finally {
    await server.close();
  }
});

it('POST /api/request: без BOT_TOKEN/CHAT_ID — 503 и запись в лог без телефона', async () => {
  const mock = createFetchMock();
  const logger = createLogger();
  const server = await startServer({ env: {}, fetchImpl: mock.fetchImpl, logger });
  try {
    const response = await server.post(VALID);
    expect(response.status).toBe(503);
    expect(mock.calls.length).toBe(0);
    expect(logger.lines.join('\n')).toMatch(/BOT_TOKEN/);
    expect(logger.lines.join('\n')).not.toMatch(/555/);
  } finally {
    await server.close();
  }
});

it('POST /api/request: ошибка Telegram — 502', async () => {
  const mock = createFetchMock(500);
  const logger = createLogger();
  const server = await startServer({ env: ENV, fetchImpl: mock.fetchImpl, logger });
  try {
    const response = await server.post(VALID);
    expect(response.status).toBe(502);
    expect(logger.lines.join('\n')).not.toMatch(/555/);
  } finally {
    await server.close();
  }
});

it('POST /api/request: ограничение частоты — 429 после лимита', async () => {
  const mock = createFetchMock();
  const server = await startServer({
    env: ENV,
    fetchImpl: mock.fetchImpl,
    logger: createLogger(),
    rateLimit: { limit: 2, windowMs: 60000 },
  });
  try {
    expect((await server.post(VALID)).status).toBe(200);
    expect((await server.post(VALID)).status).toBe(200);
    const third = await server.post(VALID);
    expect(third.status).toBe(429);
    expect(third.headers.get('retry-after')).toBeTruthy();
    expect(mock.calls.length).toBe(2);
  } finally {
    await server.close();
  }
});

function createDist() {
  const distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blizzard-dist-'));
  const write = (file, content) => {
    fs.mkdirSync(path.dirname(path.join(distDir, file)), { recursive: true });
    fs.writeFileSync(path.join(distDir, file), content);
  };
  write('index.html', '<h1>Главная</h1>');
  write('404.html', '<h1>Не найдено</h1>');
  write('ventilation/l2.html', '<h1>Blizzard L2</h1>');
  write('assets/index-abc123.js', 'console.log(1);');
  return distDir;
}

describe('раздача собранного сайта', () => {
  it('отдаёт страницы по адресам с .html и без, неизвестные — 404.html со статусом 404', async () => {
    const distDir = createDist();
    const server = await startServer({ env: ENV, distDir, logger: createLogger() });
    try {
      const home = await fetch(`${server.base}/`);
      expect(home.status).toBe(200);
      expect(await home.text()).toMatch(/Главная/);
      for (const url of ['/ventilation/l2.html', '/ventilation/l2']) {
        const page = await fetch(server.base + url);
        expect(page.status, url).toBe(200);
        expect(await page.text()).toMatch(/Blizzard L2/);
      }
      const missing = await fetch(`${server.base}/nope.html`);
      expect(missing.status).toBe(404);
      expect(await missing.text()).toMatch(/Не найдено/);
    } finally {
      await server.close();
      fs.rmSync(distDir, { recursive: true, force: true });
    }
  });

  it('скрипты и стили из /assets кешируются надолго, страницы — на час', async () => {
    const distDir = createDist();
    const server = await startServer({ env: ENV, distDir, logger: createLogger() });
    try {
      const asset = await fetch(`${server.base}/assets/index-abc123.js`);
      expect(asset.status).toBe(200);
      expect(asset.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
      const page = await fetch(`${server.base}/ventilation/l2.html`);
      expect(page.headers.get('cache-control')).toBe('public, max-age=3600');
    } finally {
      await server.close();
      fs.rmSync(distDir, { recursive: true, force: true });
    }
  });

  it('добавляет заголовки безопасности к страницам и к API', async () => {
    const distDir = createDist();
    const server = await startServer({ env: ENV, distDir, logger: createLogger() });
    try {
      for (const url of ['/', '/api/unknown']) {
        const response = await fetch(server.base + url);
        for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
          expect(response.headers.get(name), `${url} ${name}`).toBe(value);
        }
      }
    } finally {
      await server.close();
      fs.rmSync(distDir, { recursive: true, force: true });
    }
  });
});
