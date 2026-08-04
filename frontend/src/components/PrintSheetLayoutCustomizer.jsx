import React from 'react';
import { PAPER_PRESETS } from '../utils/printLayoutPresets';

/**
 * PrintSheetLayoutCustomizer — UI control panel for selecting paper size,
 * toggling cut guides, and triggering high-DPI PDF downloads.
 */
export function PrintSheetLayoutCustomizer({
  selectedPreset,
  onSelectPreset,
  showCropGuides,
  onToggleCropGuides,
  onDownloadPDF,
  isExporting = false,
}) {
  return (
    <div
      className="print-sheet-customizer"
      style={{
        padding: '1.25rem',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
        🖨️ Print Sheet Customizer
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
          Select Paper Format
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => onSelectPreset(e.target.value)}
          style={{
            padding: '0.6rem 0.8rem',
            borderRadius: '6px',
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #475569',
            fontSize: '0.9rem',
          }}
        >
          {PAPER_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name} ({preset.maxPhotos} photos)
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          id="cropGuidesToggle"
          checked={showCropGuides}
          onChange={(e) => onToggleCropGuides(e.target.checked)}
          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        />
        <label htmlFor="cropGuidesToggle" style={{ fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
          Show Cutting Guides & Alignment Lines
        </label>
      </div>

      <button
        onClick={onDownloadPDF}
        disabled={isExporting}
        style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fontWeight: 600,
          border: 'none',
          borderRadius: '8px',
          cursor: isExporting ? 'not-allowed' : 'pointer',
          transition: 'background-color 200ms ease',
        }}
      >
        {isExporting ? 'Generating PDF...' : '📥 Download Printable Sheet (PDF)'}
      </button>
    </div>
  );
}

export default PrintSheetLayoutCustomizer;
