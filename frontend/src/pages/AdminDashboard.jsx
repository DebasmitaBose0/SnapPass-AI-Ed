import React, { useState } from 'react';
import SystemConfigForm from '../components/SystemConfigForm';
import './AdminDashboard.css';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h2>System Administration Settings</h2>
      <SystemConfigForm />
    </div>
  );
}
