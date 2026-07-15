import React from 'react';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="route-error-fallback" role="alert">
      <div className="route-error-fallback__content">
        <h2>Page could not be loaded</h2>
        <p>{error?.message || 'An unexpected error occurred while loading this page.'}</p>
        <div className="route-error-fallback__actions">
          <button onClick={resetErrorBoundary}>Try again</button>
          <button onClick={() => window.location.href = '/'}>
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
