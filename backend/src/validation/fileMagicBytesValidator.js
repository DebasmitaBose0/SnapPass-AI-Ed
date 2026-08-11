/**
 * fileMagicBytesValidator.js — Binary stream header magic bytes validator
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export function validateMagicBytes(buffer) {
  if (!buffer || buffer.length < 4) return { valid: false, mime: 'unknown' };

  const hexHeader = buffer.slice(0, 4).toString('hex').toUpperCase();

  if (hexHeader.startsWith('FFD8FF')) return { valid: true, mime: 'image/jpeg' };
  if (hexHeader.startsWith('89504E47')) return { valid: true, mime: 'image/png' };
  if (hexHeader.startsWith('52494646')) return { valid: true, mime: 'image/webp' };

  return { valid: false, mime: 'disguised_executable' };
}
