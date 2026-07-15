import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '../../hooks/useErrorHandler';

describe('useErrorHandler', () => {
  it('starts with null error', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.error).toBeNull();
  });

  it('sets error from Error object', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => {
      result.current.handleError(new Error('Upload failed'));
    });
    expect(result.current.error).toBe('Upload failed');
  });

  it('extracts message from axios-style error response', () => {
    const { result } = renderHook(() => useErrorHandler());
    const axiosError = {
      response: { data: { message: 'File too large' } },
      message: 'Request failed',
    };
    act(() => {
      result.current.handleError(axiosError);
    });
    expect(result.current.error).toBe('File too large');
  });

  it('falls back to default message when no message is available', () => {
    const { result } = renderHook(() => useErrorHandler('Fallback message'));
    act(() => {
      result.current.handleError(null);
    });
    expect(result.current.error).toBe('Fallback message');
  });

  it('clears error', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => result.current.handleError(new Error('test')));
    expect(result.current.error).toBe('test');
    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
