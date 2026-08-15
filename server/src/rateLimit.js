// Minimal in-memory fixed-window rate limiter (no extra dependency).
// Guards brute-force attempts on auth endpoints. Per-client IP.
export default function rateLimit({
  windowMs = 15 * 60 * 1000,
  max = 10,
  message = 'Trop de tentatives. Réessayez plus tard.',
} = {}) {
  const hits = new Map();
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) {
      if (now - v.t > windowMs) hits.delete(k);
    }
  }, Math.min(windowMs, 10 * 60 * 1000));
  if (typeof timer.unref === 'function') timer.unref();

  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const rec = hits.get(key);
    if (!rec || now - rec.t > windowMs) {
      hits.set(key, { t: now, n: 1 });
      return next();
    }
    rec.n += 1;
    if (rec.n > max) {
      res.set('Retry-After', Math.ceil((rec.t + windowMs - now) / 1000));
      return res.status(429).json({ error: message });
    }
    return next();
  };
}
