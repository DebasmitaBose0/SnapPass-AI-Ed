import React from 'react';

function UploadProgress({ progress, darkMode, label, showLabel = false }) {
  if (progress <= 0 || progress >= 100 && !showLabel) return null;

  const barColor =
    progress < 50
      ? 'var(--color-warning)'
      : progress < 80
        ? 'var(--color-primary)'
        : 'var(--color-success)';

  return (
    <div style={{ marginTop: '8px' }}>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: darkMode ? '#94a3b8' : '#64748b',
            marginBottom: '4px',
          }}
        >
          <span>{label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Upload progress: ${progress}%`}
        style={{
          width: '100%',
          height: '6px',
          background: darkMode ? '#1e293b' : '#e2e8f0',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: barColor,
            borderRadius: '999px',
            transition: 'width 0.4s ease, background 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

export default UploadProgress;
