import React from 'react';
import './HeadPoseOverlay.css';

export default function HeadPoseOverlay({ angles, isCompliant }) {
  if (!angles) return null;

  return (
    <div className={`head-pose-badge ${isCompliant ? 'compliant' : 'non-compliant'}`}>
      <span>Pitch: {angles.pitch}°</span>
      <span>Yaw: {angles.yaw}°</span>
      <span>Roll: {angles.roll}°</span>
    </div>
  );
}
