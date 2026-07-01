import React, { useEffect, useMemo, useState } from 'react';
import './CompliancePanel.css';

const statusToBadge = (status) => {
  if (status === 'pass') return { label: 'PASS', cls: 'badge-pass' };
  if (status === 'warn') return { label: 'WARN', cls: 'badge-warn' };
  if (status === 'fail') return { label: 'FAIL', cls: 'badge-fail' };
  return { label: String(status || '—').toUpperCase(), cls: 'badge-neutral' };
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
                <div className={`compliance-panel__badge ${badge.cls}`}>{badge.label}</div>
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

