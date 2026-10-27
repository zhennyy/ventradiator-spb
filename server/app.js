// Express-приложение: POST /api/request (заявка → Telegram) и раздача собранного сайта из dist/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createRateLimiter } from './rate-limit.js';
import { sendToTelegram } from './telegram.js';
import { validateRequest } from './validate.js';

const DEFAULT_DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

// Базовые заголовки безопасности для всех ответов (те же — в public/_headers для Netlify)
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export function createApp({
  env = process.env,
  distDir = DEFAULT_DIST,
  fetchImpl = fetch,
  logger = console,
  rateLimit = {},
} = {}) {
  const app = express();
  const limiter = createRateLimiter(rateLimit);
  app.disable('x-powered-by');
  if (env.TRUST_PROXY) app.set('trust proxy', 1);
  app.use((req, res, next) => {
    res.set(SECURITY_HEADERS);
    next();
  });

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

  // Скрипты и стили сборки — с хешем в имени, их можно кешировать надолго; страницы — на час.
  app.use('/assets', express.static(path.join(distDir, 'assets'), { immutable: true, maxAge: '1y' }));
  // Адрес без .html: сначала ищем <адрес>.html. Иначе /ventilation сначала увидел бы папку dist/ventilation/
  // (там страницы категорий), перенаправил на /ventilation/ и отдал 404.
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    let clean;
    try {
      clean = path.posix.normalize(decodeURIComponent(req.path)).replace(/\/+$/, '');
    } catch {
      return next(); // битый %-код в адресе — пусть дальше отвечает 404
    }
    if (!clean || path.posix.extname(clean)) return next();
    const file = path.join(distDir, `${clean}.html`);
    if (!file.startsWith(distDir + path.sep)) return next();
    return fs.existsSync(file) ? res.set('Cache-Control', 'public, max-age=3600').sendFile(file) : next();
  });
  app.use(express.static(distDir, { extensions: ['html'], maxAge: '1h', redirect: false }));
  app.use((req, res) => res.status(404).sendFile(path.join(distDir, '404.html')));

  app.locals.stopRateLimiter = limiter.stop;
  return app;
}
