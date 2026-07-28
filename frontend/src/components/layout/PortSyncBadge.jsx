import React, { useState, useEffect } from 'react';
import { subscribePortSync, scanBackendPorts } from '../../services/portSync';
import './PortSyncBadge.css';

export default function PortSyncBadge() {
  const [syncState, setSyncState] = useState({ status: 'idle', port: null });

  useEffect(() => {
    const unsubscribe = subscribePortSync((event) => {
      setSyncState(event);
    });
    return () => unsubscribe();
  }, []);

  if (!import.meta.env.DEV) return null;

  return (
    <div className={`port-sync-badge port-sync-${syncState.status}`} title="Backend Port Sync Status">
      <span className="port-sync-dot" />
      <span className="port-sync-text">
        {syncState.status === 'connected' && `Port: ${syncState.port}`}
        {syncState.status === 'scanning' && 'Scanning ports...'}
        {syncState.status === 'disconnected' && 'Backend offline'}
        {syncState.status === 'idle' && 'Port Sync Idle'}
      </span>
      {syncState.status === 'disconnected' && (
        <button 
          className="port-sync-retry-btn"
          onClick={() => scanBackendPorts()}
        >
          Retry
        </button>
      )}
    </div>
  );
}
