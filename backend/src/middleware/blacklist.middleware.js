import { tokenStore } from '../utils/tokenStore.js';
import { RevocationStoreService } from '../services/revocationStore.service.js';

export const checkTokenBlacklist = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (tokenStore.has(token) || RevocationStoreService.isRevoked(token)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Session has been logged out.'
      });
    }
  }
  next();
};

