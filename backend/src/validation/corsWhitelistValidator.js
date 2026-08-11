/**
 * corsWhitelistValidator.js — Dynamic CORS Whitelist Inspector
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export function isOriginAllowed(origin, whitelist = []) {
  if (!origin) return true;
  return whitelist.includes(origin);
}
