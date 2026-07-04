import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback">
          <div className="error-boundary-content">
            <h2>Something went wrong</h2>
            <p className="error-boundary-message">
              {this.state.error?.message || 'An unexpected error occurred while loading this page.'}
            </p>
            <div className="error-boundary-actions">
              <button onClick={this.handleRetry} className="error-boundary-btn error-boundary-btn--retry">
                Try Again
              </button>
              <button onClick={this.handleGoBack} className="error-boundary-btn error-boundary-btn--back">
                Go Back
              </button>
              <button onClick={() => window.location.reload()} className="error-boundary-btn error-boundary-btn--reload">
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
