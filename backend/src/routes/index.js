import express from 'express';
import uploadRoutes from './upload.routes.js';
import complianceRoutes from './compliance.routes.js';
import diagnosticsRoutes from './diagnostics.routes.js';

const router = express.Router();

router.use('/upload', uploadRoutes);
router.use('/compliance', complianceRoutes);
router.use('/diagnostics', diagnosticsRoutes);

export default router;
