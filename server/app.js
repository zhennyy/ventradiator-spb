// Express-приложение: POST /api/request (заявка → Telegram) и раздача собранного сайта из dist/.
const path = require('node:path');
const express = require('express');
const { validateRequest } = require('./validate');
const { createRateLimiter } = require('./rate-limit');
const { sendToTelegram } = require('./telegram');

function createApp({
  env = process.env,
  distDir = path.join(__dirname, '..', 'dist'),
  fetchImpl = fetch,
  logger = console,
  rateLimit = {},
} = {}) {
  const app = express();
  const limiter = createRateLimiter(rateLimit);
  app.disable('x-powered-by');
  if (env.TRUST_PROXY) app.set('trust proxy', 1);

  app.post('/api/request', limiter.middleware, express.json({ limit: '10kb' }), async (req, res) => {
    const result = validateRequest(req.body);
    if (!result.ok) return res.status(400).json({ ok: false, error: result.error });

    if (!env.BOT_TOKEN || !env.CHAT_ID) {
      logger.error('Заявка не отправлена: не заданы BOT_TOKEN и/или CHAT_ID');
      return res.status(503).json({ ok: false, error: 'Приём заявок временно недоступен' });
    }
    try {
      await sendToTelegram({ token: env.BOT_TOKEN, chatId: env.CHAT_ID, request: result.data, fetchImpl });
      // Телефон и имя в лог не пишем — только факт заявки и товар.
      logger.info(`Заявка отправлена в Telegram${result.data.product ? ` (товар: ${result.data.product})` : ''}`);
      return res.json({ ok: true });
    } catch (error) {
      logger.error(`Заявка не отправлена: ${error.message}`);
      return res.status(502).json({ ok: false, error: 'Не удалось отправить заявку' });
    }
  });

  // Битый JSON и слишком большое тело — понятный ответ вместо стека ошибки.
  app.use('/api', (error, req, res, next) => {
    if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large') {
      return res.status(400).json({ ok: false, error: 'Некорректная заявка' });
    }
    return next(error);
  });
  app.use('/api', (req, res) => res.status(404).json({ ok: false, error: 'Не найдено' }));

  app.use(express.static(distDir, { extensions: ['html'], maxAge: '1h' }));
  app.use((req, res) => res.status(404).sendFile(path.join(distDir, '404.html')));

  app.locals.stopRateLimiter = limiter.stop;
  return app;
}

module.exports = { createApp };
