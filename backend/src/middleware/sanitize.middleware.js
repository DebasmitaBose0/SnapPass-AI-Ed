import mongoSanitize from "express-mongo-sanitize";

// Helper to recursively strip HTML tags from strings and protect against prototype pollution
const cleanHtmlTags = (val) => {
  if (typeof val === "string") {
    // Strip HTML tag brackets and potential XSS script syntax
    return val.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();
  }
  if (Array.isArray(val)) {
    return val.map(cleanHtmlTags);
  }
  if (typeof val === "object" && val !== null) {
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        // Prevent Prototype Pollution
        if (key === "__proto__" || key === "constructor" || key === "prototype") {
          delete val[key];
          continue;
        }
        val[key] = cleanHtmlTags(val[key]);
      }
    }
  }
  return val;
};

export const sanitizeInput = (req, res, next) => {
  // Apply mongo sanitize on body, params, headers, query
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);

  // Apply custom HTML XSS cleaning
  if (req.body) req.body = cleanHtmlTags(req.body);
  if (req.query) req.query = cleanHtmlTags(req.query);
  if (req.params) req.params = cleanHtmlTags(req.params);

  next();
};

