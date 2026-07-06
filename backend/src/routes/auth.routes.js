import express from 'express';
import { deleteAccount } from '../controllers/auth.controller.js';

const router = express.Router();

router.delete('/delete-account', deleteAccount);

export default router;
