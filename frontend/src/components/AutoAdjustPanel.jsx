import React from 'react';
import './AutoAdjustPanel.css';

export default function AutoAdjustPanel() {
  return (
    <div className="auto-adjust-panel">
      <button className="fix-btn">🪄 Auto Enhance Contrast</button>
      <button className="fix-btn">☀️ Balance Brightness</button>
    </div>
  );
}
