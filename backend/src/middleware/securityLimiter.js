import { logger } from '../utils/logger.js';

const requestCounts = new Map();

/**
 * Custom Rate Limiter Middleware
 * Tracks request count per IP and rejects requests exceeding the limit.
 */
export function securityLimiter(limit = 100, windowMs = 15 * 60 * 1000) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const timestamps = requestCounts.get(ip);
    // Filter out timestamps outside the sliding window
    const activeTimestamps = timestamps.filter(t => now - t < windowMs);
    
    if (activeTimestamps.length >= limit) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    activeTimestamps.push(now);
    requestCounts.set(ip, activeTimestamps);
    next();
  };
}
