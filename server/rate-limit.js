// Простое ограничение частоты заявок: не больше `limit` за `windowMs` с одного IP.
// Хранится в памяти процесса — для одного сервера этого достаточно.
function createRateLimiter({ limit = 5, windowMs = 10 * 60 * 1000, now = () => Date.now() } = {}) {
  const hits = new Map();

  function cleanup() {
    const current = now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= current) hits.delete(key);
    }
  }
  const timer = setInterval(cleanup, windowMs);
  timer.unref();

  function middleware(req, res, next) {
    const key = req.ip || 'unknown';
    const current = now();
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= current) {
      entry = { count: 0, resetAt: current + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > limit) {
      res.set('Retry-After', String(Math.ceil((entry.resetAt - current) / 1000)));
      return res.status(429).json({ ok: false, error: 'Слишком много заявок. Попробуйте позже.' });
    }
    return next();
  }

  return { middleware, stop: () => clearInterval(timer) };
}

module.exports = { createRateLimiter };
