import axios from 'axios';
import { getApiBaseUrl } from '../utils/apiConfig';

const apiBaseUrl = getApiBaseUrl();

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

import { logApiError } from '../utils/errorTracker';

api.interceptors.response.use(
  (response) => response,
  (error) => {
    logApiError(error);
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export default api;
