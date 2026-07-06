import express from 'express';
import uploadRoutes from './upload.routes.js';
import complianceRoutes from './compliance.routes.js';
import feedbackRoutes from './feedback.routes.js';

const router = express.Router();

router.use('/upload', uploadRoutes);
router.use('/compliance', complianceRoutes);
router.use('/feedback', feedbackRoutes);

export default router;
