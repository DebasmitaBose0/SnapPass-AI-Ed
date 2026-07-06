import React from 'react';
import DiagnosticsReport from '../components/DiagnosticsReport';
import './DiagnosticsPage.css';

export default function DiagnosticsPage() {
  return (
    <div className="diagnostics-page">
      <h2>General System Health diagnostics</h2>
      <DiagnosticsReport />
    </div>
  );
}
