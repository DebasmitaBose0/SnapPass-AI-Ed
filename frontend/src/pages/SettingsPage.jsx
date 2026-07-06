import React from 'react';
import ActivityLogList from '../components/ActivityLogList';
import './SettingsPage.css';

export default function SettingsPage() {
  return (
    <div className="settings-page">
      <h2>User Security Configurations</h2>
      <ActivityLogList />
    </div>
  );
}
