/**
 * fileValidation.formatter.js — MIME & Header Validation Error Formatter
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export function formatHeaderValidationError(detectedType) {
  return {
    success: false,
    error: 'INVALID_HEADER_MAGIC_BYTES',
    message: `File header mismatch. File appears to be '${detectedType}' disguised as an allowed format.`,
  };
}
