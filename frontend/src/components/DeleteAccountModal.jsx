import React, { useState } from 'react';
import './DeleteAccountModal.css';

export default function DeleteAccountModal({ onClose }) {
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    if (confirmText === 'DELETE') {
      fetch('/api/auth/delete-account', { method: 'DELETE' }).then(() =>
        onClose()
      );
    }
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h3>Confirm Permanent Account Deletion</h3>
        <p>
          Type "DELETE" to confirm permanent deletion of all uploads and data.
        </p>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
        <button onClick={handleDelete} disabled={confirmText !== 'DELETE'}>
          Confirm Delete
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
