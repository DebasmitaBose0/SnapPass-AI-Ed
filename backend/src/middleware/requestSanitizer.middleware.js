import { sanitizePayloadDeep } from '../utils/payloadSanitizer.utils.js';

export const deepRequestSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitizePayloadDeep(req.body);
  if (req.query) req.query = sanitizePayloadDeep(req.query);
  if (req.params) req.params = sanitizePayloadDeep(req.params);
  next();
};

