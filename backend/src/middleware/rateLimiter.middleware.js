import { createRateLimiter } from './rateLimiter.middleware.js';
import { slidingWindowRateLimiter } from './slidingWindowRateLimiter.middleware.js';

export const batchOperationLimiter = slidingWindowRateLimiter({
  windowMs: 5 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many batch requests, please try again in 5 minutes.'
});

export { createRateLimiter, slidingWindowRateLimiter };
