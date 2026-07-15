import express from 'express';
import { uploadMiddleware, validateImageChain, validateBatchFiles } from '../middleware/upload.middleware.js';
import { uploadPhoto, batchUpload } from '../controllers/upload.controller.js';

const router = express.Router();

router.post('/', uploadMiddleware.single('file'), validateImageChain, uploadPhoto);
router.post('/batch', uploadMiddleware.array('files', 20), validateBatchFiles, batchUpload);

export default router;
