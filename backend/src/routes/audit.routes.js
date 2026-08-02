import express from 'express';
import {
  getAuditLogs,
  getAuditSummary,
  getSecurityAuditLogs
} from '../controllers/audit.controller.js';

const router = express.Router();

router.get('/', getAuditLogs);
router.get('/summary', getAuditSummary);
router.get('/security', getSecurityAuditLogs);

export default router;
