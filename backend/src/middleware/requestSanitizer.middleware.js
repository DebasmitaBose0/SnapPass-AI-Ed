import { sanitizeObject } from '../utils/sanitizerRules.js';

const sanitizeValue = (val) => {
  if (typeof val === 'string') {
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/\$where/gi, '');
  }
  if (typeof val === 'object' && val !== null) {
    if (Array.isArray(val)) {
      return val.map(sanitizeValue);
    }
    const cleanObj = {};
    for (const key of Object.keys(val)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue; // Prototype pollution protection
      }
      const cleanKey = key.replace(/^\$/, ''); // Prevent NoSQL injection ($gt, $ne, etc)
      cleanObj[cleanKey] = sanitizeValue(val[key]);
    }
    return cleanObj;
  }
  return val;
};

export const deepRequestSanitizer = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
    sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
    sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
    sanitizeObject(req.params);
  }
  next();
};

export default deepRequestSanitizer;
