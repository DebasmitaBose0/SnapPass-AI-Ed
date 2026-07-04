import React, { useEffect, useMemo, useState } from 'react';
import './CompliancePanel.css';

const STATUS_ICONS = {
  pass: (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path fill="currentColor" d="M6.5 11.5l-3-3 1-1 2 2 5-5 1 1z"/>
    </svg>
  ),
  warn: (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path fill="currentColor" d="M8 1L1 14h14zM7 5h2v4H7zm0 5h2v2H7z"/>
    </svg>
  ),
  fail: (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path fill="currentColor" d="M8 6.59L11.29 3.3l1.41 1.42L9.42 8l3.28 3.29-1.41 1.41L8 9.42l-3.29 3.28-1.42-1.41L6.59 8 3.3 4.71l1.42-1.42z"/>
    </svg>
  ),
};

const statusToBadge = (status) => {
  if (status === 'pass') return { label: 'PASS', cls: 'badge-pass', icon: STATUS_ICONS.pass };
  if (status === 'warn') return { label: 'WARN', cls: 'badge-warn', icon: STATUS_ICONS.warn };
  if (status === 'fail') return { label: 'FAIL', cls: 'badge-fail', icon: STATUS_ICONS.fail };
  return { label: String(status || '—').toUpperCase(), cls: 'badge-neutral', icon: null };
};

function CompliancePanel({ compliance, loading, error, darkMode }) {
  const items = compliance?.items || [];
  const hardFail = Boolean(compliance?.hard_fail);

  const headerText = useMemo(() => {
    if (loading) return 'Checking compliance…';
    if (error) return 'Compliance check unavailable';
    if (!items.length) return 'No checks yet';
    return hardFail ? 'Not ICAO-compliant yet' : 'Looks compliant (pre-check)';
  }, [loading, error, items.length, hardFail]);

  return (
    <aside
      className={`compliance-panel card ${darkMode ? 'compliance-panel-dark' : ''}`}
      aria-label="Passport photo compliance checklist"
    >
      <div className="compliance-panel__header">
        <div className="compliance-panel__title">Compliance Inspector</div>
        <div className={`compliance-panel__summary ${hardFail ? 'summary-fail' : 'summary-ok'}`}>
          {headerText}
        </div>
      </div>

      {loading && (
        <div className="compliance-panel__loading">Running real-time checks…</div>
      )}

      {!!error && !loading && (
        <div className="compliance-panel__error">
          <div className="compliance-panel__error-title">Couldn’t run compliance check</div>
          <div className="compliance-panel__error-detail">{error}</div>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="compliance-panel__list" role="list">
          {items.map((it) => {
            const badge = statusToBadge(it.status);
            return (
              <div className="compliance-panel__item" key={it.id} role="listitem">
                <div className="compliance-panel__item-left">
                  <div className="compliance-panel__item-title">{it.title}</div>
                  <div className="compliance-panel__item-detail">{it.detail}</div>
                </div>
                <div className={`compliance-panel__badge ${badge.cls}`}>{badge.icon} {badge.label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="compliance-panel__note">
        Pre-checks are heuristic. Use the final printed result per local passport regulations.
      </div>
    </aside>
  );
}

export default CompliancePanel;

