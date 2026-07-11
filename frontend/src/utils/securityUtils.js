export function sanitizeFilename(name) {
  if (!name || typeof name !== 'string') return '';
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '').trim();
}

export function validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) {
  if (!file || !file.type) return false;
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file, maxBytes = 10 * 1024 * 1024) {
  if (!file) return false;
  return file.size <= maxBytes && file.size > 0;
}

export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  try {
    const parsed = new URL(url, window.location.origin);
    const allowedProtocols = ['http:', 'https:', 'blob:', 'data:'];
    if (!allowedProtocols.includes(parsed.protocol)) return '';
    return parsed.href;
  } catch {
    return '';
  }
}

export function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

export function validatePresetId(presetId, allowedPresets = ['35x45', '51x51', '33x48', '40x60', '2x2in']) {
  if (!presetId || typeof presetId !== 'string') return false;
  return allowedPresets.includes(presetId);
}

export function validateBackgroundColour(colour) {
  if (!colour || typeof colour !== 'string') return false;
  const namedColours = ['white', 'off-white', 'blue', 'light-blue', 'grey', 'red'];
  if (namedColours.includes(colour)) return true;
  return /^#[0-9a-fA-F]{6}$/.test(colour);
}

export function isLocalDevelopment() {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

export function getCspViolationReport() {
  if (typeof document === 'undefined') return [];
  const observer = new ReportingObserver((reports) => {
    for (const report of reports) {
      if (report.type === 'csp-violation') {
        console.warn('[CSP] Violation:', report.body);
      }
    }
  }, { types: ['csp-violation'] });
  observer.observe();
  return observer;
}
