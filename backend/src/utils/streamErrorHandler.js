/**
 * streamErrorHandler.js — Stream Response Error Interceptor
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export function handleStreamError(err, res) {
  console.error('Archive Stream Exception:', err);
  if (!res.headersSent) {
    res.status(500).json({ success: false, error: 'ARCHIVE_STREAM_FAILURE' });
  } else {
    res.destroy();
  }
}
