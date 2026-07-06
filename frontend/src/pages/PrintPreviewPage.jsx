import React from 'react';
import CustomTemplateBuilder from '../components/CustomTemplateBuilder';
import './PrintPreviewPage.css';

export default function PrintPreviewPage() {
  return (
    <div className="print-preview-page">
      <h2>Review & Export layouts</h2>
      <CustomTemplateBuilder />
    </div>
  );
}
