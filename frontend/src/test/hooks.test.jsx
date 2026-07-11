import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('returns default value when key does not exist', async () => {
    const { useLocalStorage } = await import('../hooks/useLocalStorage');
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  test('persists and retrieves value', async () => {
    const { useLocalStorage } = await import('../hooks/useLocalStorage');
    const { result } = renderHook(() => useLocalStorage('test-key', ''));

    act(() => {
      result.current[1]('stored-value');
    });

    expect(result.current[0]).toBe('stored-value');
    expect(localStorage.getItem('test-key')).toBe('"stored-value"');
  });
});

describe('useSessionManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('saveSession stores data correctly', async () => {
    const { saveSession, getSession } = await import('../utils/sessionManager');
    act(() => {
      saveSession({ filename: 'test.jpg', step: 'upload' });
    });
    const session = getSession();
    expect(session.filename).toBe('test.jpg');
    expect(session.step).toBe('upload');
    expect(session.updatedAt).toBeDefined();
  });

  test('clearSession removes stored data', async () => {
    const { saveSession, getSession, clearSession } = await import('../utils/sessionManager');
    act(() => {
      saveSession({ filename: 'test.jpg' });
    });
    act(() => {
      clearSession();
    });
    expect(getSession()).toBeNull();
  });

  test('saveSessionToHistory adds to history list', async () => {
    const { saveSessionToHistory, getSessionHistory } = await import('../utils/sessionManager');
    act(() => {
      saveSessionToHistory({ filename: 'photo.jpg', status: 'completed' });
    });
    const history = getSessionHistory();
    expect(history.length).toBe(1);
    expect(history[0].filename).toBe('photo.jpg');
  });

  test('strips blob URLs from persisted data', async () => {
    const { saveSession, getSession } = await import('../utils/sessionManager');
    act(() => {
      saveSession({ filename: 'test.jpg', localUrl: 'blob:http://test/123', step: 'upload' });
    });
    const session = getSession();
    expect(session.localUrl).toBeUndefined();
    expect(session.filename).toBe('test.jpg');
  });
});

describe('useDocumentMeta', () => {
  test('sets document title', async () => {
    const { useDocumentMeta } = await import('../hooks/useDocumentMeta');
    renderHook(() => useDocumentMeta({ title: 'Test Page', description: 'Test description' }));
    expect(document.title).toContain('Test Page');
  });
});

describe('useFormValidation', () => {
  test('validates required fields', async () => {
    const { useFormValidation } = await import('../hooks/useFormValidation');
    const rules = { name: { required: true, minLength: 2 } };
    const { result } = renderHook(() => useFormValidation({ name: '' }, rules));

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.name).toBeDefined();
  });

  test('passes valid fields', async () => {
    const { useFormValidation } = await import('../hooks/useFormValidation');
    const rules = { email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } };
    const { result } = renderHook(() => useFormValidation({ email: 'test@example.com' }, rules));

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.valid).toBe(true);
  });
});

describe('useFocusTrap', () => {
  test('returns ref and active state', async () => {
    const { useFocusTrap } = await import('../hooks/useFocusTrap');
    const { result } = renderHook(() => useFocusTrap(true));
    expect(result.current.focusRef).toBeDefined();
    expect(typeof result.current.focusRef.current).toBe('object');
  });
});
