import React, { useState, useEffect } from 'react';
import './ActivityLogList.css';

export default function ActivityLogList() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/activity')
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, []);

  return (
    <div className="activity-log-list">
      <h3>Active Session Security Logs</h3>
      {logs.map((log) => (
        <div key={log.id} className="log-entry">
          <span>{log.action}</span> -{' '}
          <span>{new Date(log.time).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
}
