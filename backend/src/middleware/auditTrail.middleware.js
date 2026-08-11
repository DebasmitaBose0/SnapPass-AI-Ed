/**
 * auditTrail.middleware.js — Audit Trail Middleware
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { AuditLoggerService } from '../services/auditLogger.service.js';

export function auditTrailMiddleware(req, res, next) {
  AuditLoggerService.logSecurityEvent('API_REQUEST', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
}
