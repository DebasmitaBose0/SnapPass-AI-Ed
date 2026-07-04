import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import ScrollToTop from './ScrollToTop';

const HomePage = lazy(() => import('../pages/HomePage'));
const UploadPage = lazy(() => import('../pages/UploadPage'));
const EditorPage = lazy(() => import('../pages/EditorPage'));
const PrintPreviewPage = lazy(() => import('../pages/PrintPreviewPage'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const PhotoStudio = lazy(() => import('../pages/PhotoStudio'));
const HistoryPage = lazy(() => import('../pages/HistoryPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const DiagnosticsPage = lazy(() => import('../pages/DiagnosticsPage'));
const PassportComparatorPage = lazy(
  () => import('../pages/PassportComparatorPage')
);
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

function wrapPage(Component, props) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullPage delayMs={250} />}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

function AppRoutes({ darkMode, toggleTheme }) {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={wrapPage(HomePage, { darkMode, toggleTheme })} />
        <Route path="/upload" element={wrapPage(UploadPage, { darkMode, toggleTheme })} />
        <Route path="/editor" element={wrapPage(EditorPage, { darkMode, toggleTheme })} />
        <Route path="/print-preview" element={wrapPage(PrintPreviewPage, { darkMode, toggleTheme })} />
        <Route path="/admin" element={wrapPage(AdminDashboard, { darkMode, toggleTheme })} />
        <Route path="/terms" element={wrapPage(TermsPage)} />
        <Route path="/privacy" element={wrapPage(PrivacyPage)} />
        <Route path="/studio" element={wrapPage(PhotoStudio)} />
        <Route path="/settings" element={wrapPage(SettingsPage, { darkMode, toggleTheme })} />
        <Route path="/diagnostics" element={wrapPage(DiagnosticsPage, { darkMode })} />
        <Route path="/history" element={wrapPage(HistoryPage, { darkMode, toggleTheme })} />
        <Route path="/compare-requirements" element={wrapPage(PassportComparatorPage, { darkMode, toggleTheme })} />
        <Route path="*" element={wrapPage(NotFoundPage, { darkMode })} />
      </Routes>
    </>
  );
}

export default AppRoutes;
