/**
 * auditLogger.service.js — Structured JSON Security Audit Trail Logger
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export class AuditLoggerService {
  static logSecurityEvent(eventType, details = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      eventType,
      details,
    };
    console.log('[SECURITY_AUDIT]', JSON.stringify(entry));
    return entry;
  }
}
