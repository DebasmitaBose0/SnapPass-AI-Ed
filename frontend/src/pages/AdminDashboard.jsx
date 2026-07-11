import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../translations/translations';
import { DASHBOARD_TABS, METRIC_CARDS, EMPTY_STATS, STATUS_BADGE, QUICK_ACTIONS } from '../data/AdminDashboardData';

function AdminDashboard() {
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/analytics/stats');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const body = await res.json();
      if (body.success) setAnalytics(body.data);
    } catch (err) {
      setError('Could not load analytics. Ensure the server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetch('/api/admin/users')
        .then(r => r.json())
        .then(d => { if (d.success) setUsers(d.data); })
        .catch(() => {});
    }
    if (activeTab === 'system') {
      fetch('/api/admin/system')
        .then(r => r.json())
        .then(d => { if (d.success) setSystemInfo(d.data); })
        .catch(() => {});
    }
  }, [activeTab]);

  const stats = analytics
    ? METRIC_CARDS.map((card) => ({
        ...card,
        label: t[card.key] || card.key,
        value: analytics.stats?.[card.key] ?? analytics[card.key] ?? 0,
      }))
    : METRIC_CARDS.map((card) => ({
        ...card,
        label: t[card.key] || card.key,
        value: loading ? '...' : '\u2014',
      }));

  const handleQuickAction = async (action) => {
    setActionLoading(true);
    try {
      if (action === 'refresh') {
        await fetchData();
      } else if (action === 'cleanup') {
        await fetch('/api/cleanup', { method: 'POST' });
        await fetchData();
      }
    } catch {}
    setActionLoading(false);
  };

  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const renderIcon = (icon) => {
    const paths = {
      upload: 'M12 16V5 M8 9l4-4 4 4 M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3',
      print: 'M6 9V4h12v5 M4 10h16v7H4z M7 17v3h10v-3 M9 13h6',
      palette: 'M12 4a8 8 0 1 0 0 16h1a2 2 0 1 0 0-4h-1a4 4 0 0 1 0-8 M7.5 10h1 M10 7.5h1 M14 7.5h1 M16.5 10h1',
      calendar: 'M4 5h16v15H4z M8 3v4 M16 3v4 M4 9h16',
      chart: 'M4 19h16 M6 17V9 M12 17V5 M18 17v-7',
      users: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2',
      trash: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M10 11v6 M14 11v6 M9 6V4h6v2',
      refresh: 'M23 4v6h-6 M1 20v-6h6 M3.5 9a9 9 0 0 1 14.2-3.2L23 10 M1 14l5.3 4.2A9 9 0 0 0 20.5 15',
      download: 'M12 16V5 M8 9l4-4 4 4 M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3',
    };
    const d = paths[icon] || paths.chart;
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {d.split(' ').map((p, i) => {
          const match = p.match(/([A-Z])/);
          return match ? <path key={i} d={p} /> : <path key={i} d={`M${p}`} />;
        })}
      </svg>
    );
  };

  return (
    <div className={`admin-page-toggle ${darkMode ? 'admin-page-toggle-dark' : ''}`}>
      <div className="admin-page">
        <div className={`admin-page__header ${darkMode ? 'admin-page__header-dark' : ''}`}>
          <div>
            <h1 className={`title ${darkMode ? 'title-dark' : ''}`}>{t.adminDashboard}</h1>
            <p className="section-subtitle">{t.adminSubtitle}</p>
          </div>
          <div className="admin-page__badges">
            {loading && <span className="badge badge-blue">Loading...</span>}
            {error && <span className="badge badge-red" title={error}>Error</span>}
            {analytics && !loading && <span className="badge badge-green">Live</span>}
          </div>
        </div>

        <div className="admin-page__quick-actions">
          {QUICK_ACTIONS.map((qa) => (
            <button
              key={qa.id}
              className={`admin-quick-btn ${darkMode ? 'admin-quick-btn-dark' : ''}`}
              onClick={() => handleQuickAction(qa.action)}
              disabled={actionLoading}
            >
              {renderIcon(qa.icon)}
              <span>{qa.label}</span>
            </button>
          ))}
        </div>

        <div className={`admin-tabs ${darkMode ? 'admin-tabs-dark' : ''}`}>
          {DASHBOARD_TABS.map(({ key, labelKey }) => (
            <button
              key={key}
              className={`admin-tab ${activeTab === key ? (darkMode ? 'admin-tab--active-dark' : 'admin-tab--active-light') : ''}`}
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
            >
              {t[labelKey] || labelKey}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="admin-overview" role="tabpanel">
            <div className="stats-grid">
              {stats.map(({ label, value, icon, color }) => (
                <div key={label} className="stat-card card" style={{ borderTopColor: color }}>
                  <span className="stat-card__icon" aria-hidden="true">
                    {renderIcon(icon)}
                  </span>
                  <span className="stat-card__value">{value}</span>
                  <span className="stat-card__label">{label}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="admin-error card">
                <p>{error}</p>
                <button className="btn btn-sm btn-outline" onClick={fetchData}>Retry</button>
              </div>
            )}

            {!analytics && !loading && !error && (
              <div className="admin-placeholder card">
                <p className="admin-placeholder__icon">{renderIcon('chart')}</p>
                <p className={`admin-placeholder__title ${darkMode ? 'admin-placeholder__title-dark' : ''}`}>{t.analyticsSoon}</p>
                <p className="admin-placeholder__desc">{t.analyticsDesc}</p>
              </div>
            )}

            {analytics && (
              <div className="admin-panel-group">
                <div className="admin-panel card">
                  <h3 className="admin-panel__title">Recent Uploads</h3>
                  {analytics.recentUploads?.length > 0 ? (
                    <div className="admin-recent-list">
                      {analytics.recentUploads.slice(0, 5).map((u) => (
                        <div key={u.id} className="admin-recent-item">
                          <span className="admin-recent-name">{u.filename}</span>
                          <span className="admin-recent-date">{new Date(u.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="admin-empty-text">{t.noUploads}</p>
                  )}
                </div>
                <div className="admin-panel card">
                  <h3 className="admin-panel__title">User Stats</h3>
                  <div className="admin-stat-rows">
                    <div className="admin-stat-row">
                      <span>Total Users</span>
                      <span className="admin-stat-value">{analytics.stats?.totalUsers || 0}</span>
                    </div>
                    <div className="admin-stat-row">
                      <span>Today New</span>
                      <span className="admin-stat-value">{analytics.stats?.newToday || analytics.stats?.todayUploads || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-uploads card" role="tabpanel">
            <table className={`admin-table ${darkMode ? 'admin-table-dark' : ''}`}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.fullName || 'N/A'}</td>
                      <td>{u.email}</td>
                      <td><span className="badge badge-blue">{u.role}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="admin-table__empty-row">
                    <td colSpan={4}>{t.noUploads}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="admin-uploads card" role="tabpanel">
            <table className={`admin-table ${darkMode ? 'admin-table-dark' : ''}`}>
              <thead>
                <tr>
                  <th>{t.fileName}</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.recentUploads?.length > 0 ? (
                  analytics.recentUploads.map((u) => (
                    <tr key={u.id}>
                      <td>{u.filename}</td>
                      <td>{new Date(u.date).toLocaleDateString()}</td>
                      <td>
                        <span className="badge badge-green">Completed</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="admin-table__empty-row">
                    <td colSpan={3}>{t.noUploads}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="admin-settings card" role="tabpanel">
            <h3 className={`admin-panel__title ${darkMode ? 'admin-placeholder__title-dark' : ''}`}>
              System Information
            </h3>
            {systemInfo ? (
              <div className="admin-stat-rows">
                <div className="admin-stat-row">
                  <span>Node Version</span>
                  <span className="admin-stat-value">{systemInfo.nodeVersion}</span>
                </div>
                <div className="admin-stat-row">
                  <span>Platform</span>
                  <span className="admin-stat-value">{systemInfo.platform}</span>
                </div>
                <div className="admin-stat-row">
                  <span>Uptime</span>
                  <span className="admin-stat-value">{formatUptime(systemInfo.uptime)}</span>
                </div>
                <div className="admin-stat-row">
                  <span>Total Requests</span>
                  <span className="admin-stat-value">{systemInfo.metrics?.totalRequests || 0}</span>
                </div>
                <div className="admin-stat-row">
                  <span>Active Requests</span>
                  <span className="admin-stat-value">{systemInfo.metrics?.activeRequests || 0}</span>
                </div>
                <div className="admin-stat-row">
                  <span>Avg Response Time</span>
                  <span className="admin-stat-value">
                    {systemInfo.metrics?.latency?.avg
                      ? `${Math.round(systemInfo.metrics.latency.avg)}ms`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            ) : (
              <p className={`admin-placeholder__desc ${darkMode ? 'admin-placeholder__title-dark' : ''}`}>
                Connect to the backend to view system information.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
