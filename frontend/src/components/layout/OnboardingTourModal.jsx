import React from 'react';
import './OnboardingTourModal.css';

export default function OnboardingTourModal({ isOpen, step, onNext, onClose }) {
  if (!isOpen) return null;

  const stepsData = [
    { title: 'Welcome to SnapPass AI', desc: 'Upload your portrait photo to start automatic biometric formatting.' },
    { title: 'AI Background Removal', desc: 'Automatic background removal produces a clean studio backdrop.' },
    { title: 'Print Grid Setup', desc: 'Export high DPI printable sheets for international passports.' },
  ];

  const current = stepsData[step] || stepsData[0];

  return (
    <div className="onboarding-modal-backdrop">
      <div className="onboarding-modal-card">
        <h3>{current.title}</h3>
        <p>{current.desc}</p>
        <div className="onboarding-actions">
          <button onClick={onNext} className="next-step-btn">Next</button>
          <button onClick={onClose} className="skip-tour-btn">Skip</button>
        </div>
      </div>
    </div>
  );
}
