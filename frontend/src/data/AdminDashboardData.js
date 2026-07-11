export const DASHBOARD_TABS = [
  { key: 'overview', labelKey: 'overview', icon: 'chart' },
  { key: 'users', labelKey: 'users', icon: 'users' },
  { key: 'uploads', labelKey: 'uploadsTab', icon: 'upload' },
  { key: 'system', labelKey: 'system', icon: 'settings' },
];

export const METRIC_CARDS = [
  { key: 'totalUploads', icon: 'upload', color: '#3b82f6' },
  { key: 'totalProcessed', icon: 'palette', color: '#8b5cf6' },
  { key: 'totalSheets', icon: 'print', color: '#22c55e' },
  { key: 'todayUploads', icon: 'calendar', color: '#f59e0b' },
];

export const EMPTY_STATS = {
  totalUploads: 0,
  totalProcessed: 0,
  totalSheets: 0,
  todayUploads: 0,
  totalUsers: 0,
  activeSessions: 0,
};

export const STATUS_BADGE = {
  completed: { bg: '#dcfce7', text: '#166534', label: 'Completed' },
  processing: { bg: '#dbeafe', text: '#1e40af', label: 'Processing' },
  failed: { bg: '#fee2e2', text: '#991b1b', label: 'Failed' },
  queued: { bg: '#fef3c7', text: '#92400e', label: 'Queued' },
};

export const QUICK_ACTIONS = [
  { id: 'cleanup', label: 'Cleanup Temp Files', icon: 'trash', action: 'cleanup' },
  { id: 'refresh', label: 'Refresh Stats', icon: 'refresh', action: 'refresh' },
  { id: 'export', label: 'Export Report', icon: 'download', action: 'export' },
];
