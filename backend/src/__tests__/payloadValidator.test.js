/**
 * payloadValidator.test.js — Payload Validator Middleware Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { formatSuccessResponse, formatErrorResponse } from '../utils/apiResponse.formatter.js';

describe('ApiResponse Formatter Tests', () => {
  it('should format success responses', () => {
    const res = formatSuccessResponse({ id: 1 });
    expect(res.success).toBe(true);
    expect(res.data.id).toBe(1);
  });

  it('should format error responses', () => {
    const res = formatErrorResponse('BAD_REQUEST', 'Invalid payload');
    expect(res.success).toBe(false);
    expect(res.error).toBe('BAD_REQUEST');
  });
});
