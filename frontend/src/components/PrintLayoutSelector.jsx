import React from 'react';
import './PrintLayoutSelector.css';

function PrintLayoutSelector({
  paperSize,
  onPaperSizeChange,
  photoGap,
  onPhotoGapChange,
  showCropMarks,
  onShowCropMarksChange,
  darkMode,
}) {
  const paperOptions = [
    { id: 'a4', name: 'A4 Paper', desc: '210mm x 297mm (Standard)' },
    { id: 'letter', name: 'US Letter', desc: '8.5" x 11" (USA/Canada)' },
    { id: '4x6', name: '4"x6" Photo Card', desc: '102mm x 152mm (Pocket)' },
  ];

  return (
    <div className={`print-layout-selector ${darkMode ? 'print-layout-selector--dark' : ''}`}>
      <h3 className="layout-selector-title">🖨️ Print Layout Settings</h3>

      <div className="layout-selector-group">
        <label className="layout-selector-label">Select Paper Size</label>
        <div className="paper-options-grid">
          {paperOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`paper-option-btn ${paperSize === opt.id ? 'active' : ''}`}
              onClick={() => onPaperSizeChange(opt.id)}
            >
              <div className="paper-option-name">{opt.name}</div>
              <div className="paper-option-desc">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="layout-selector-group">
        <label className="layout-selector-label">Photo Spacing (Gap): {photoGap}px</label>
        <input
          type="range"
          min="2"
          max="20"
          step="1"
          value={photoGap}
          onChange={(e) => onPhotoGapChange(parseInt(e.target.value, 10))}
          className="spacing-slider"
        />
      </div>

      <div className="layout-selector-group">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={showCropMarks}
            onChange={(e) => onShowCropMarksChange(e.target.checked)}
          />
          <span className="checkbox-label">Include Cut Line Crop Marks</span>
        </label>
      </div>
    </div>
  );
}

export default PrintLayoutSelector;
