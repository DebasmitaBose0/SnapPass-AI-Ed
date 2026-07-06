import express from 'express';
import { getConfig } from '../controllers/systemConfig.controller.js';

const router = express.Router();

router.get('/', getConfig);

export default router;
