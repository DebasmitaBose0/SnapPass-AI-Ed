/**
 * auditTrail.test.js — Audit Trail Middleware Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { sanitizeAuditPayload } from '../utils/payloadSanitizer.js';

describe('AuditTrail Payload Sanitizer Tests', () => {
  it('should redact sensitive password fields', () => {
    const res = sanitizeAuditPayload({ password: 'secret123', user: 'admin' });
    expect(res.password).toBe('***REDACTED***');
    expect(res.user).toBe('admin');
  });
});
