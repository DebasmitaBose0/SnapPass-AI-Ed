import React, { useState } from 'react';
import { passportPresetsData } from '../../data/passportPresets.data';
import './PresetSelectorModal.css';

export default function PresetSelectorModal({ isOpen, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;

  const filtered = passportPresetsData.filter((p) =>
    p.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="preset-modal-backdrop">
      <div className="preset-modal-card">
        <h3>Passport Presets</h3>
        <input
          type="text"
          placeholder="Search country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="preset-search-input"
        />
        <div className="preset-list">
          {filtered.map((item) => (
            <div key={item.id} className="preset-item" onClick={() => onSelect(item)}>
              <span>{item.country}</span>
              <small>{item.widthMm} x {item.heightMm} mm</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
