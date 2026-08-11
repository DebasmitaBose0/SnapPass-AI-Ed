/**
 * magicBytes.test.js — Magic Bytes Validator Unit Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { validateMagicBytes } from '../validation/fileMagicBytesValidator.js';

describe('MagicBytesValidator Tests', () => {
  it('should validate jpeg header', () => {
    const buf = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]);
    expect(validateMagicBytes(buf).valid).toBe(true);
  });

  it('should reject text header', () => {
    const buf = Buffer.from('hello world');
    expect(validateMagicBytes(buf).valid).toBe(false);
  });
});
