import React, { useState, useEffect } from 'react';
import './SecurityBanner.css';

function SecurityBanner({ darkMode }) {
  const [isHttps, setIsHttps] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const secure = window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    setIsHttps(secure);

    if (!secure && !localStorage.getItem('snappass-security-dismissed')) {
      setShowBanner(true);
    }
  }, []);

  const dismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem('snappass-security-dismissed', 'true');
    } catch {}
  };

  if (!showBanner) return null;

  return (
    <div
      className={`security-banner ${darkMode ? 'security-banner--dark' : ''}`}
      role="alert"
    >
      <span className="security-banner__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      </span>
      <span className="security-banner__text">
        Connection is not secure. Uploaded photos are transmitted over HTTP.
      </span>
      <button
        className="security-banner__dismiss"
        onClick={dismiss}
        aria-label="Dismiss security notice"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default SecurityBanner;
