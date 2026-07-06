import React from 'react';
import AutoAdjustPanel from '../components/AutoAdjustPanel';
import './PhotoStudio.css';

export default function PhotoStudio() {
  return (
    <div className="photo-studio">
      <h2>SnapPass AI Photo Studio workspace</h2>
      <AutoAdjustPanel />
    </div>
  );
}
