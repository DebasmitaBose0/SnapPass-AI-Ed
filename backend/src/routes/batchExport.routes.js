import { Router } from 'express';
import { handleBatchExport } from '../controllers/batchExport.controller.js';
import { batchOperationLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

/**
 * POST /api/batch-export
 * Export multiple processed passport photos in a single zip archive with sliding window rate limiting
 */
router.post('/batch-export', batchOperationLimiter, handleBatchExport);

export default router;
