/**
 * payloadValidator.middleware.js — Express Request Payload Schema Validator
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export function validatePayloadSchema(requiredFields = []) {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => !(field in req.body));
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'SCHEMA_VALIDATION_FAILURE',
        missingFields: missing,
      });
    }
    next();
  };
}
