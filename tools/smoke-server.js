// Сервер для проверок в браузере (tools/smoke.js, tools/screens.js): как в продакшене,
// но Telegram подменён — заявки складываются в telegramCalls.
import { createApp } from '../server/app.js';

export async function startServer(telegramCalls = []) {
  const fetchImpl = async (url, options) => {
    telegramCalls.push(JSON.parse(options.body).text);
    return { ok: true, status: 200 };
  };
  const app = createApp({
    env: { BOT_TOKEN: 'smoke', CHAT_ID: 'smoke' },
    fetchImpl,
    logger: { info() {}, error() {} },
    rateLimit: { limit: 1000 },
  });
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });
  return {
    base: `http://127.0.0.1:${server.address().port}`,
    stop: () => (app.locals.stopRateLimiter(), server.close()),
  };
}
