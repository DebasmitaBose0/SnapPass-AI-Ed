/**
 * healthResponse.formatter.js — RFC-compliant health response payload formatter.
 */

export const formatHealthResponse = (status, details = {}) => {
  const statusCode = status === 'UP' ? 200 : status === 'DEGRADED' ? 503 : 500;
  return {
    status,
    statusCode,
    timestamp: new Date().toISOString(),
    service: 'snappass-ai-backend',
    version: process.env.npm_package_version || '1.0.0',
    details,
  };
};
