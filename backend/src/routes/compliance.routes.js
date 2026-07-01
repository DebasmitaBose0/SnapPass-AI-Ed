/**
 * Compliance Routes
 * POST /api/compliance-check — Runs real-time passport photo compliance checklist.
 */

import express from "express";
import { complianceCheck } from "../controllers/compliance.controller.js";

const router = express.Router();

router.post("/check", complianceCheck);

export default router;

