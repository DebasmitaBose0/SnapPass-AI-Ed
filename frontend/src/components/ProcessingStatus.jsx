import React from 'react';
import useProcessingProgress from '../hooks/useProcessingProgress';
import './ProcessingStatus.css';

const STATUS_LABELS = {
  idle: 'Waiting',
  queued: 'Queued',
  processing: 'AI Processing...',
  done: 'Complete',
  failed: 'Failed',
};

const STAGE_ICONS = {
  Initializing: '⚙️',
  'Validating file': '🔍',
  'Quality check passed': '✅',
  'Sending to AI service': '📡',
  'AI processing complete': '🎨',
  'Saving result': '💾',
  Complete: '✅',
  Failed: '❌',
};

const ProcessingStatus = ({ jobId, progress, stage, status, error }) => {
  const sse = useProcessingProgress(jobId);
  const effectiveProgress = progress ?? sse.progress ?? 0;
  const effectiveStage = stage ?? sse.stage ?? '';
  const effectiveStatus = status ?? sse.status ?? 'idle';
  const effectiveError = error ?? sse.error ?? null;

  const displayLabel = STATUS_LABELS[effectiveStatus] || effectiveStatus;
  const stageIcon = STAGE_ICONS[effectiveStage] || '🔄';
  const isActive = effectiveStatus === 'processing' || effectiveStatus === 'queued';
  const isFailed = effectiveStatus === 'failed';

  return (
    <div
      className={`processing-status processing-status--${effectiveStatus}`}
      role="status"
      aria-live="polite"
      aria-valuenow={effectiveProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="processing-status__header">
        <span className="processing-status__indicator" />
        <span className="processing-status__label">{displayLabel}</span>
      </div>

      {isActive && (
        <div className="processing-status__progress-track">
          <div
            className="processing-status__progress-fill"
            style={{ width: `${effectiveProgress}%` }}
          />
          <span className="processing-status__progress-text">
            {effectiveProgress}%
          </span>
        </div>
      )}

      {effectiveStage && (
        <div className="processing-status__stage">
          <span className="processing-status__stage-icon">{stageIcon}</span>
          <span className="processing-status__stage-label">{effectiveStage}</span>
        </div>
      )}

      {effectiveError && (
        <div className="processing-status__error">
          <span aria-hidden="true">⚠️</span> {effectiveError}
        </div>
      )}
    </div>
  );
};

export default ProcessingStatus;

export { STATUS_LABELS, STAGE_ICONS };
