import express from 'express';
import { getActivityLog } from '../controllers/activity.controller.js';

const router = express.Router();

router.get('/', getActivityLog);

export default router;
