import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import { useNotifications } from '../../context/NotificationContext';
import './Navbar.css';

export default function Navbar({ darkMode, toggleTheme }) {
  const { language, setLanguage } = useLanguage();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const t = translations[language];
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          SnapPass AI
        </Link>
        <div className="navbar__menu">
          <Link to="/upload" className="navbar__item">
            {t.navUpload || 'Upload'}
          </Link>
          <Link to="/history" className="navbar__item">
            {t.navHistory || 'History'}
          </Link>
          <Link to="/settings" className="navbar__item">
            {t.navSettings || 'Settings'}
          </Link>

          <div className="navbar__notifications" onClick={markAllAsRead}>
            <span className="navbar__bell">🔔</span>
            {unreadCount > 0 && (
              <span className="navbar__badge">{unreadCount}</span>
            )}
          </div>

          <button onClick={toggleTheme} className="navbar__theme-toggle">
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
}
