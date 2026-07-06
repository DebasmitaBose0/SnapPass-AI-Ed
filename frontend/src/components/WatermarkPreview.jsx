import React from 'react';
import './WatermarkPreview.css';

export default function WatermarkPreview({ imageUrl }) {
  return (
    <div className="watermark-preview">
      <img src={imageUrl} alt="Preview with watermark" />
      <span className="watermark-text">SnapPass AI - Demo Version</span>
    </div>
  );
}
