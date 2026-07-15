import { useState, useCallback } from 'react';

export function useErrorHandler(defaultMessage = 'An error occurred') {
  const [error, setError] = useState(null);

  const handleError = useCallback((err) => {
    const message = err?.response?.data?.message || err?.message || defaultMessage;
    setError(message);
    return message;
  }, [defaultMessage]);

  const clearError = useCallback(() => setError(null), []);

  return { error, handleError, clearError };
}
