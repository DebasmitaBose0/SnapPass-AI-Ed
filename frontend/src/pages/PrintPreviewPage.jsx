import React, { useState, useEffect } from 'react';
import QuantityInput from '../components/QuantityInput';
import PrintButton from '../components/PrintButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { generateSheet } from '../services/photoService';
import { useLocation } from 'react-router-dom';

const PrintPreviewPage = () => {
  const { state } = useLocation();

  const [quantity, setQuantity] = useState(6);
  const [sheetUrl, setSheetUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSheet = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await generateSheet({
        processedId: state?.processedId,
        quantity,
      });
      setSheetUrl(result.sheetUrl);
    } catch (err) {
      setError(
        err.message || 'Failed to generate print sheet. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page print-preview-page">
      <h1>Print Preview</h1>
      <p className="page__subtitle">
        Your A4 print-ready sheet is ready to download.
      </p>

      <ErrorMessage message={error} onRetry={fetchSheet} />

      {loading ? (
        <LoadingSpinner message="Generating your A4 print sheet..." />
      ) : (
        <>
          {sheetUrl && (
            <img
              className="print-preview__sheet"
              src={sheetUrl}
              alt="A4 passport photo print sheet"
            />
          )}
          <QuantityInput value={quantity} onChange={setQuantity} />
          <PrintButton
            sheetUrl={sheetUrl}
            onRegenerate={fetchSheet}
            disabled={!sheetUrl}
          />
        </>
      )}
    </div>
  );
};

export default PrintPreviewPage;
