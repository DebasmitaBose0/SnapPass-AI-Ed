import React, { useState } from 'react';
import FeedbackModal from '../components/FeedbackModal';
import './PrintPreviewPage.css';

export default function PrintPreviewPage() {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="print-preview-page">
      <h2>Print Preview & Download</h2>
      <button onClick={() => setShowFeedback(true)} className="download-btn">
        Download Passport Photos
      </button>
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </div>
  );
}
