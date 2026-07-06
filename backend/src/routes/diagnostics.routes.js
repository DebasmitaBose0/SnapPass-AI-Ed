import express from 'express';
import { checkImageDiagnostics } from '../controllers/diagnostics.controller.js';

const router = express.Router();

router.get('/', checkImageDiagnostics);

export default router;
