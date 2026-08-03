import { tokenRevocationStore } from '../utils/tokenRevocationStore.js';

export const checkTokenBlacklist = (req, res, next) => {
  const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.substring(7) : null);
  if (token && tokenRevocationStore.isRevoked(token)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Session token has been revoked.'
    });
  }
  next();
};
