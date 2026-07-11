import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const SUPPORTED_LANGUAGES = ['en', 'hi', 'fr', 'es', 'de', 'bn'];
const DEFAULT_LANG = 'en';

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem('snappass_language');
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored;
    const browserLang = navigator.language?.split('-')[0];
    if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang)) return browserLang;
  } catch {}
  return DEFAULT_LANG;
}

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;
    setLanguageState(lang);
    try {
      localStorage.setItem('snappass_language', lang);
    } catch {}
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const idx = SUPPORTED_LANGUAGES.indexOf(prev);
      const next = SUPPORTED_LANGUAGES[(idx + 1) % SUPPORTED_LANGUAGES.length];
      try {
        localStorage.setItem('snappass_language', next);
      } catch {}
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
