import React, { useState, useEffect } from 'react';
import './SystemConfigForm.css';

export default function SystemConfigForm() {
  const [maxSize, setMaxSize] = useState(10);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => setMaxSize(data.maxFileSize / 1024 / 1024));
  }, []);

  return (
    <form className="system-config-form" onSubmit={(e) => e.preventDefault()}>
      <label>Maximum Upload Size (MB):</label>
      <input
        type="number"
        value={maxSize}
        onChange={(e) => setMaxSize(parseInt(e.target.value))}
      />
      <button type="submit">Save Configurations</button>
    </form>
  );
}
