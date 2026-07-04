import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SnapPassAssistant from './chatbot/SnapPassAssistant';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './App.css';
import ScrollToTopButton from './components/ScrollToTopButton';

function AppContent() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <main className="app-main">
        <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme} />
      </main>
      <Footer darkMode={darkMode} toggleTheme={toggleTheme} />
      <SnapPassAssistant />
      <ScrollToTopButton />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
