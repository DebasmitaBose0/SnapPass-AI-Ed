import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { useBatchUpload } from '../hooks/useBatchUpload';
import { uploadPhoto } from '../services/photoService';
import BatchUploadBox from '../components/BatchUploadBox';
import UploadProgress from '../components/UploadProgress';
import { iconMap } from '../data/UploadPageData';
import './BatchPreviewPage.css';

function BatchPreviewPage({ darkMode }) {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const {
    addFiles,
    startUpload,
    abort,
    reset,
    results,
    uploading,
    progress,
    hasPending,
  } = useBatchUpload();

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFilesSelected = useCallback((files) => {
    addFiles(files);
  }, [addFiles]);

  useEffect(() => {
    if (results.length > 0 && !uploading && !hasPending) {
      const completed = results
        .filter((r) => r.status === 'done' && r.response?.data)
        .map((r) => r.response.data);
      setUploadedFiles(completed);
    }
  }, [results, uploading, hasPending]);

  const handleUploadAll = async () => {
    await startUpload('/api/upload');
  };

  const handleSelectAll = () => {
    if (uploadedFiles.length > 0) {
      navigate('/editor', {
        state: {
          filename: uploadedFiles[0].filename,
          fileUrl: uploadedFiles[0].fileUrl,
          batchFiles: uploadedFiles,
        },
      });
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay },
    }),
  };

  return (
    <div className={`batch-toggle ${darkMode ? 'batch-toggle-dark' : ''}`}>
      <div className="batch-page page-content">
        <motion.div
          className="batch-page__header"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          <h1 className={`section-title ${darkMode ? 'section-title-dark' : ''}`}>
            Batch Upload
          </h1>
          <p className={`section-subtitle ${darkMode ? 'section-subtitle-dark' : ''}`}>
            Upload multiple photos at once for bulk processing
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
          {uploadedFiles.length === 0 && !uploading && (
            <BatchUploadBox onFilesSelected={handleFilesSelected} maxFiles={10} />
          )}

          {results.length > 0 && !uploading && !hasPending && uploadedFiles.length === 0 && (
            <div className="batch-page__empty card">
              <p>No files were uploaded successfully. Check file formats and try again.</p>
              <button
                className={`btn ${darkMode ? 'btn-secondary-dark' : 'btn-secondary'}`}
                onClick={reset}
              >
                Try Again
              </button>
            </div>
          )}

          {results.length > 0 && (
            <div className="batch-page__results card">
              <div className="batch-page__results-header">
                <span className="batch-page__results-count">
                  {progress.completed} / {progress.total} uploaded
                </span>
                {progress.failed > 0 && (
                  <span className="batch-page__results-failed">
                    {progress.failed} failed
                  </span>
                )}
              </div>

              <div className="batch-page__results-grid">
                {results.map((item) => (
                  <div
                    key={item.id}
                    className={`batch-page__thumb batch-page__thumb--${item.status}`}
                    title={item.file?.name || 'File'}
                  >
                    <div className="batch-page__thumb-icon" aria-hidden="true">
                      {item.status === 'done' && iconMap.check}
                      {item.status === 'failed' && iconMap.close}
                      {item.status === 'processing' && iconMap.refresh}
                      {item.status === 'queued' && iconMap.upload}
                    </div>
                    <span className="batch-page__thumb-name">
                      {(item.file?.name || '').substring(0, 16)}
                      {(item.file?.name || '').length > 16 ? '...' : ''}
                    </span>
                    {item.status === 'failed' && (
                      <span className="batch-page__thumb-error">{item.error}</span>
                    )}
                  </div>
                ))}
              </div>

              <UploadProgress
                progress={progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0}
                darkMode={darkMode}
              />

              <div className="batch-page__actions">
                {hasPending && !uploading && (
                  <button
                    className="btn btn-primary"
                    onClick={handleUploadAll}
                    disabled={uploading}
                  >
                    Upload All ({results.filter(r => r.status === 'queued').length} files)
                  </button>
                )}
                {uploading && (
                  <button
                    className="btn btn-secondary"
                    onClick={abort}
                  >
                    Cancel
                  </button>
                )}
                {uploadedFiles.length > 0 && (
                  <button
                    className={`btn ${darkMode ? 'btn-secondary-dark' : 'btn-secondary'}`}
                    onClick={handleSelectAll}
                  >
                    Edit First Photo ({uploadedFiles.length} ready)
                  </button>
                )}
                {(uploading || uploadedFiles.length > 0) && (
                  <button
                    className="btn btn-ghost"
                    onClick={reset}
                  >
                    Start Over
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default BatchPreviewPage;
