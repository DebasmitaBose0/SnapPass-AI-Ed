import React from 'react';
import './AttireOverlayControl.css';

export default function AttireOverlayControl({ scale, onScaleChange }) {
  return (
    <div className="attire-overlay-control">
      <label>Attire Scale: {scale}x</label>
      <input
        type="range"
        min="0.5"
        max="1.5"
        step="0.05"
        value={scale}
        onChange={(e) => onScaleChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
