import React, { useState, useEffect } from 'react';
import './DiagnosticsReport.css';

export default function DiagnosticsReport() {
  const [status, setStatus] = useState({});

  useEffect(() => {
    fetch('/api/diagnostics')
      .then((res) => res.json())
      .then((data) => setStatus(data));
  }, []);

  return (
    <div className="diagnostics-report">
      <h3>Image Parameters Diagnostic</h3>
      <p>Dimensions Check: {status.dimensions}</p>
      <p>Face Match: {status.faceDetected ? 'Passed' : 'Failed'}</p>
    </div>
  );
}
