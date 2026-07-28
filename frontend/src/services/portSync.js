import api from './api';

const DEFAULT_CANDIDATE_PORTS = [3000, 3001, 3002, 3003, 5000, 5005, 8080];
let isScanning = false;
let currentActivePort = null;
const listeners = new Set();

/**
 * Register a listener callback to receive port sync status updates.
 */
export function subscribePortSync(listener) {
  listeners.add(listener);
  if (currentActivePort !== null) {
    listener({ status: 'connected', port: currentActivePort });
  }
  return () => listeners.delete(listener);
}

function notifyListeners(event) {
  listeners.forEach(fn => fn(event));
}

/**
 * Probes a specific port to see if a SnapPass backend is running there.
 */
export async function probePort(port, timeoutMs = 1200) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`http://localhost:${port}/health`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data && (data.service === 'snappass-backend' || data.service === 'SnapPass AI Backend')) {
      return { port, meta: data };
    }
  } catch (err) {
    // Port not open or request timed out
  } finally {
    clearTimeout(timeoutId);
  }
  return null;
}

/**
 * Scans candidate ports to locate an active backend instance.
 * Updates the Axios baseURL and returns the working port, or null.
 */
export async function scanBackendPorts(customPorts = DEFAULT_CANDIDATE_PORTS) {
  if (isScanning) return currentActivePort;
  isScanning = true;
  notifyListeners({ status: 'scanning' });

  try {
    const probes = customPorts.map(port => probePort(port));
    const results = await Promise.all(probes);
    const match = results.find(res => res !== null);

    if (match) {
      const activePort = match.port;
      const newUrl = `http://localhost:${activePort}/api`;
      api.defaults.baseURL = newUrl;
      currentActivePort = activePort;
      sessionStorage.setItem('snappass_backend_port', activePort.toString());
      console.log(`[SnapPass Sync] Backend auto-discovered on port ${activePort}. API Base URL: ${newUrl}`);
      notifyListeners({ status: 'connected', port: activePort, meta: match.meta });
      return activePort;
    }
    notifyListeners({ status: 'disconnected' });
  } catch (error) {
    console.error('[SnapPass Sync] Error scanning ports:', error);
    notifyListeners({ status: 'error', error });
  } finally {
    isScanning = false;
  }
  return null;
}

/**
 * Gets the initially configured API base URL, honoring any active port overrides.
 */
export function getInitialBaseUrl() {
  if (import.meta.env.DEV) {
    const savedPort = sessionStorage.getItem('snappass_backend_port');
    if (savedPort) {
      currentActivePort = parseInt(savedPort, 10);
      return `http://localhost:${savedPort}/api`;
    }
  }
  return import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');
}

/**
 * Retrieves current active port context.
 */
export function getCurrentActivePort() {
  return currentActivePort;
}

