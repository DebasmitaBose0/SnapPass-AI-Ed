/**
 * apiResponse.formatter.js — Uniform API JSON Error & Success Formatter
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export function formatSuccessResponse(data, message = 'Success') {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function formatErrorResponse(code, message) {
  return {
    success: false,
    error: code,
    message,
    timestamp: new Date().toISOString(),
  };
}
