import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SnapPassAssistant from './chatbot/SnapPassAssistant';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';
import ScrollToTopButton from './components/ScrollToTopButton';

function App() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        console.log('Keyboard shortcut triggered');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );
  }, [darkMode]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute(
      'data-theme',
      next ? 'dark' : 'light'
    );
    localStorage.setItem('theme', next ? 'dark' : 'light');
    return next;
  };

  return (
    <ToastProvider>
      <NotificationProvider>
        <div className="app-shell">
          <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
          <main className="app-main">
            <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme} />
          </main>
          <Footer darkMode={darkMode} toggleTheme={toggleTheme} />
          <SnapPassAssistant />
          <ScrollToTopButton />
        </div>
      </NotificationProvider>
    </ToastProvider>
  );
}
export default App;
