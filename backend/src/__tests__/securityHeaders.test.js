/**
 * securityHeaders.test.js — Security Headers Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { isOriginAllowed } from '../validation/corsWhitelistValidator.js';

describe('CorsWhitelistValidator Tests', () => {
  it('should validate allowed origins', () => {
    expect(isOriginAllowed('http://localhost:3000', ['http://localhost:3000'])).toBe(true);
    expect(isOriginAllowed('http://malicious.com', ['http://localhost:3000'])).toBe(false);
  });
});
