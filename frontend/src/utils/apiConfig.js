const DEV_FALLBACK = 'http://localhost:3000/api';

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? DEV_FALLBACK : '/api');
}

export function getBackendRoot() {
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}
