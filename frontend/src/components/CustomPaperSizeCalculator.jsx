import React, { useState } from 'react';
import './CustomPaperSizeCalculator.css';

function CustomPaperSizeCalculator({ onApplyCustomPaper, darkMode }) {
  const [widthMm, setWidthMm] = useState(210);
  const [heightMm, setHeightMm] = useState(297);
  const [dpi, setDpi] = useState(300);

  const pxWidth = Math.round((widthMm / 25.4) * dpi);
  const pxHeight = Math.round((heightMm / 25.4) * dpi);

  const handleApply = () => {
    onApplyCustomPaper({
      widthMm,
      heightMm,
      dpi,
      pxWidth,
      pxHeight,
      label: `Custom (${widthMm}×${heightMm}mm @ ${dpi}DPI)`,
    });
  };

  return (
    <div className={`custom-paper-calculator ${darkMode ? 'custom-paper-calculator-dark' : ''}`}>
      <h4 className="calc-title">📄 Custom Paper Dimensions Calculator</h4>

      <div className="calc-inputs-grid">
        <div className="calc-field">
          <label className="calc-label">Width (mm)</label>
          <input
            type="number"
            min="50"
            max="1000"
            value={widthMm}
            onChange={(e) => setWidthMm(Number(e.target.value))}
            className="calc-input"
          />
        </div>

        <div className="calc-field">
          <label className="calc-label">Height (mm)</label>
          <input
            type="number"
            min="50"
            max="1000"
            value={heightMm}
            onChange={(e) => setHeightMm(Number(e.target.value))}
            className="calc-input"
          />
        </div>

        <div className="calc-field">
          <label className="calc-label">Resolution (DPI)</label>
          <select
            value={dpi}
            onChange={(e) => setDpi(Number(e.target.value))}
            className="calc-select"
          >
            <option value="150">150 DPI (Draft)</option>
            <option value="300">300 DPI (High Quality)</option>
            <option value="600">600 DPI (Ultra Fine)</option>
          </select>
        </div>
      </div>

      <div className="calc-summary">
        <span>Canvas Resolution: <strong>{pxWidth} × {pxHeight} px</strong></span>
        <button
          type="button"
          onClick={handleApply}
          className="calc-apply-btn"
        >
          Apply Custom Paper
        </button>
      </div>
    </div>
  );
}

export default CustomPaperSizeCalculator;
