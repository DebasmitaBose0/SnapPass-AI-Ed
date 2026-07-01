/**
 * Image Processing Routes
 * POST /api/process        — Process uploaded image (bg removal, face centre, resize)
 * GET  /api/process/preview/:filename — Get preview of processed image
 */

import express from "express";
import { processImage, getPreview } from "../controllers/image.controller.js";

const router = express.Router();

// Legacy sync processing endpoint
router.post("/", processImage);
router.get("/preview/:filename", getPreview);

export default router;
