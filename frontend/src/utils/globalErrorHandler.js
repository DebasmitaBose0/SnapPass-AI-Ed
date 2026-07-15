export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return;

  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const message = error?.message || 'An unexpected error occurred';
    console.warn('[SnapPass] Unhandled promise rejection:', message);
    if (error?.stack) {
      console.debug('[SnapPass] Rejection stack:', error.stack);
    }
  });

  window.onerror = (message, source, lineno, colno, error) => {
    console.warn('[SnapPass] Global error:', { message, source, lineno, colno });
    if (error?.stack) {
      console.debug('[SnapPass] Error stack:', error.stack);
    }
    return true;
  };
}
