import React from 'react';
import WatermarkPreview from '../components/WatermarkPreview';
import './EditorPage.css';

export default function EditorPage() {
  return (
    <div className="editor-page">
      <h2>Adjust Passport Photo Attributes</h2>
      <WatermarkPreview imageUrl="/sample.jpg" />
    </div>
  );
}
