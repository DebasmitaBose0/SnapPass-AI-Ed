import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeCustomizerContext = createContext();

export const useThemeCustomizer = () => {
  const context = useContext(ThemeCustomizerContext);
  if (!context) {
    throw new Error('useThemeCustomizer must be used within a ThemeCustomizerProvider');
  }
  return context;
};

export const ThemeCustomizerProvider = ({ children }) => {
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('theme-accent') || 'classic-blue';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('theme-high-contrast') === 'true';
  });

  const accentColors = {
    'classic-blue': '#2563eb',
    'amber-gold': '#f59e0b',
    'emerald-green': '#10b981',
    'rose-pink': '#f43f5e',
    'indigo-purple': '#8b5cf6',
  };

  useEffect(() => {
    localStorage.setItem('theme-accent', accentColor);
    const hex = accentColors[accentColor] || '#2563eb';
    document.documentElement.style.setProperty('--primary-color', hex);
    document.documentElement.style.setProperty('--color-primary', hex);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('theme-high-contrast', highContrast);
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  const resetTheme = () => {
    setAccentColor('classic-blue');
    setHighContrast(false);
  };

  return (
    <ThemeCustomizerContext.Provider
      value={{
        accentColor,
        setAccentColor,
        accentColors,
        highContrast,
        setHighContrast,
        resetTheme,
      }}
    >
      {children}
    </ThemeCustomizerContext.Provider>
  );
};
