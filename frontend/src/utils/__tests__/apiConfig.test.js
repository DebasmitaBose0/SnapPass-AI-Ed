import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getApiBaseUrl, getBackendRoot } from '../apiConfig';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('getApiBaseUrl', () => {
  it('returns VITE_API_URL when set', () => {
    vi.stubGlobal('import', { meta: { env: { VITE_API_URL: 'http://localhost:3000/api' } } });
    expect(getApiBaseUrl()).toBe('http://localhost:3000/api');
  });

  it('returns dev fallback when VITE_API_URL is undefined and DEV is true', () => {
    vi.stubGlobal('import', { meta: { env: { DEV: true } } });
    expect(getApiBaseUrl()).toBe('http://localhost:3000/api');
  });

  it('returns /api when VITE_API_URL is undefined and DEV is false', () => {
    vi.stubGlobal('import', { meta: { env: { DEV: false } } });
    expect(getApiBaseUrl()).toBe('/api');
  });
});

describe('getBackendRoot', () => {
  it('strips /api suffix', () => {
    vi.stubGlobal('import', { meta: { env: { VITE_API_URL: 'http://localhost:3000/api' } } });
    expect(getBackendRoot()).toBe('http://localhost:3000');
  });
});
