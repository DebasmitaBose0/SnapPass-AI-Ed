/**
 * Process job routes
 *
 * POST /api/process/job
 * GET  /api/process/job/:jobId
 */

import express from 'express';
import { createProcessJob, getProcessJobStatus } from '../controllers/image.controller.js';

const router = express.Router();

router.post('/job', createProcessJob);
router.get('/job/:jobId', getProcessJobStatus);

export default router;

