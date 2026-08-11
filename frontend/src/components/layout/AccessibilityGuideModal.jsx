import React, { useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './AccessibilityGuideModal.css';

export default function AccessibilityGuideModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  useFocusTrap(modalRef, isOpen);

  if (!isOpen) return null;

  return (
    <div className="a11y-modal-backdrop" role="dialog" aria-modal="true">
      <div className="a11y-modal-card" ref={modalRef}>
        <h2>Keyboard Accessibility Guide</h2>
        <p>Press Ctrl+U to upload, Ctrl+P to export print sheet.</p>
        <button onClick={onClose} className="close-a11y-btn">Close</button>
      </div>
    </div>
  );
}
