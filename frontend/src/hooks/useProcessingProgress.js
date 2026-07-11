import { useState, useEffect, useCallback, useRef } from 'react';

export default function useProcessingProgress(jobId) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const eventSourceRef = useRef(null);

  const connect = useCallback((id) => {
    if (!id) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiBase.replace(/\/api\/?$/, '');
    const url = `${baseUrl}/api/events/job?jobId=${id}`;

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'connected') {
          setStatus(payload.data.status || 'queued');
          setProgress(payload.data.progress || 0);
          setStage(payload.data.stage || '');
        } else if (payload.type === 'job_update') {
          const d = payload.data;
          setStatus(d.status);
          setProgress(d.progress || 0);
          setStage(d.stage || '');
          if (d.processedUrl) setProcessedUrl(d.processedUrl);
          if (d.error) setError(d.error.message || 'Processing failed');
        } else if (payload.type === 'complete') {
          const d = payload.data;
          setStatus(d.status);
          setProgress(100);
          if (d.processedUrl) setProcessedUrl(d.processedUrl);
          es.close();
        }
      } catch {
      }
    };

    es.onerror = () => {
      es.close();
    };
  }, []);

  useEffect(() => {
    if (jobId) {
      connect(jobId);
    }
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [jobId, connect]);

  const reset = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setProgress(0);
    setStage('');
    setStatus('idle');
    setError(null);
    setProcessedUrl(null);
  }, []);

  return { progress, stage, status, error, processedUrl, reset };
}
