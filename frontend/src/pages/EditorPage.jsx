import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import ImageComparisonSlider from '../components/ImageComparisonSlider';
import './EditorPage.css';

const EditorPage = () => {
  const { locale } = useLanguage();
  useDocumentMeta({
    title: 'Photo Editor',
    description: 'Edit your passport photo with AI background removal, face centering, and color adjustments.',
  });

  const [originalSrc, setOriginalSrc] = useState(null);
  const [processedSrc, setProcessedSrc] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginalSrc(url);
    setProcessedSrc(null);
    setShowComparison(false);
  };

  return (
    <div className="editor-page">
      <h1>Photo Editor — {locale === 'hi' ? 'भाषा' : 'Language'}: {locale}</h1>

      <div className="editor-toolbar">
        <label className="editor-file-btn">
          Select Photo
          <input type="file" accept="image/*" onChange={handleFileSelect} hidden />
        </label>
      </div>

      {originalSrc && processedSrc && showComparison && (
        <div className="editor-comparison-section">
          <h2>Before / After</h2>
          <ImageComparisonSlider
            beforeSrc={originalSrc}
            afterSrc={processedSrc}
            alt="Photo edit comparison"
          />
        </div>
      )}

      {originalSrc && !processedSrc && (
        <div className="editor-preview">
          <img src={originalSrc} alt="Original" className="editor-preview-img" />
        </div>
      )}
    </div>
  );
};

export default EditorPage;
