import React from 'react';
import AttireOverlayControl from './AttireOverlayControl';
import './AttireSelector.css';

export default function AttireSelector({
  selected,
  onChange,
  scale,
  onScaleChange,
}) {
  const attires = [
    { id: 'none', label: 'No Attire' },
    { id: 'suit_male_01', label: 'Male Suit Dark' },
    { id: 'suit_female_01', label: 'Female Blazer Blue' },
  ];

  return (
    <div className="attire-selector">
      <h4>Smart Attire Changer</h4>
      <div className="attire-grid">
        {attires.map((a) => (
          <button
            key={a.id}
            className={`attire-btn ${selected === a.id ? 'active' : ''}`}
            onClick={() => onChange(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>
      {selected !== 'none' && (
        <AttireOverlayControl scale={scale} onScaleChange={onScaleChange} />
      )}
    </div>
  );
}
