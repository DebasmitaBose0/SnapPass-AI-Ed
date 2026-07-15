export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL ?? '/api';
}

export function getBackendRoot() {
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}
