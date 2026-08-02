const store = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of store.entries()) {
    const valid = timestamps.filter((ts) => ts.expiry > now);
    if (valid.length === 0) {
      store.delete(key);
    } else {
      store.set(key, valid);
    }
  }
}, 60000).unref();

export function slidingWindowRateLimiter(options = {}) {
  const windowMs = options.windowMs || 60000;
  const maxRequests = options.maxRequests || 100;
  const keyGenerator = options.keyGenerator || ((req) => req.ip || req.headers['x-forwarded-for'] || '127.0.0.1');

  return (req, res, next) => {
    if (process.env.NODE_ENV === 'test' && !options.enableInTest) {
      return next();
    }

    const key = keyGenerator(req);
    const now = Date.now();
    const expiry = now + windowMs;

    const timestamps = store.get(key) || [];
    const validTimestamps = timestamps.filter((t) => t.expiry > now);

    if (validTimestamps.length >= maxRequests) {
      const resetTime = Math.ceil((validTimestamps[0].expiry - now) / 1000);
      res.setHeader('Retry-After', resetTime);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      return res.status(429).json({
        success: false,
        message: options.message || 'Rate limit exceeded. Please try again later.',
        retryAfterSeconds: resetTime
      });
    }

    validTimestamps.push({ timestamp: now, expiry });
    store.set(key, validTimestamps);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - validTimestamps.length);
    next();
  };
}
