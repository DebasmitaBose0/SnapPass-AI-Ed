const FINGERPRINT_KEY = 'snappass_review_fingerprint';

function createFingerprint() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `fp-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getReviewFingerprint() {
  const existing = localStorage.getItem(FINGERPRINT_KEY);
  if (existing) {
    return existing;
  }

  const fingerprint = createFingerprint();
  localStorage.setItem(FINGERPRINT_KEY, fingerprint);
  return fingerprint;
}
