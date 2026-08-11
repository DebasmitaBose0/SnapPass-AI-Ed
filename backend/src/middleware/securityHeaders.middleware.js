/**
 * securityHeaders.middleware.js — CSP & Security Headers Middleware
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export function securityHeadersMiddleware(req, res, next) {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
}
