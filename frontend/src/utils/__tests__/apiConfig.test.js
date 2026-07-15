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

  it('returns /api when VITE_API_URL is undefined (Vite proxy handles dev)', () => {
    vi.stubGlobal('import', { meta: { env: {} } });
    expect(getApiBaseUrl()).toBe('/api');
  });
});

describe('getBackendRoot', () => {
  it('strips /api suffix from full URL', () => {
    vi.stubGlobal('import', { meta: { env: { VITE_API_URL: 'http://localhost:3000/api' } } });
    expect(getBackendRoot()).toBe('http://localhost:3000');
  });

  it('returns empty string when base is /api (Vite proxy mode)', () => {
    vi.stubGlobal('import', { meta: { env: {} } });
    expect(getBackendRoot()).toBe('');
  });
});
