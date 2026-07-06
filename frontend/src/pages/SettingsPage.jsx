import React, { useState } from 'react';
import DeleteAccountModal from '../components/DeleteAccountModal';
import './SettingsPage.css';

export default function SettingsPage() {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="settings-page">
      <h2>Account Settings</h2>
      <button onClick={() => setShowDelete(true)} className="delete-btn">
        Delete My Account Permanently
      </button>
      {showDelete && (
        <DeleteAccountModal onClose={() => setShowDelete(false)} />
      )}
    </div>
  );
}
