import { useState, useCallback } from 'react';

export default function useBatchExport(options = {}) {
  const { defaultFilenamePrefix = 'snappass-batch' } = options;
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [error, setError] = useState(null);

  const exportFiles = useCallback(async (filenames, customPrefix = defaultFilenamePrefix) => {
    if (!filenames || filenames.length === 0) return;
    setExporting(true);
    setExportProgress(10);
    setError(null);

    try {
      setExportProgress(40);
      const res = await fetch('/api/batch/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filenames }),
      });

      setExportProgress(75);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Export failed (HTTP ${res.status})`);
      }

      const blob = await res.blob();
      setExportProgress(90);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${customPrefix}-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportProgress(100);
    } catch (err) {
      setError(err.message);
      setExportProgress(0);
      throw err;
    } finally {
      setExporting(false);
    }
  }, [defaultFilenamePrefix]);

  const clearError = useCallback(() => setError(null), []);

  return { exportFiles, exporting, exportProgress, error, clearError };
}
