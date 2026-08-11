/**
 * payloadSanitizer.js — Sensitive Audit Data Payload Sanitizer
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export function sanitizeAuditPayload(payload = {}) {
  const clean = { ...payload };
  if (clean.password) clean.password = '***REDACTED***';
  if (clean.token) clean.token = '***REDACTED***';
  return clean;
}
