import { slidingWindowRateLimiter } from '../slidingWindowRateLimiter.middleware.js';

describe('Sliding Window Rate Limiter Middleware', () => {
  test('allows requests within threshold and blocks when limit exceeded', () => {
    const limiter = slidingWindowRateLimiter({ windowMs: 10000, maxRequests: 2, enableInTest: true });
    const req = { ip: '192.168.1.1' };
    const res = { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);

    limiter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
  });
});
