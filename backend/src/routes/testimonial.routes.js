import { Router } from "express";
import validate from "../middleware/validate.middleware.js";
import { testimonialSubmissionLimiter } from "../middleware/rateLimit.middleware.js";
import {
  getTestimonialsValidation,
  submitTestimonialValidation,
  updateTestimonialValidation,
} from "../validation/testimonial.validation.js";
import {
  getTestimonials,
  submitTestimonial,
  updateTestimonial,
} from "../controllers/testimonial.controller.js";

const router = Router();

router.get("/", getTestimonialsValidation, validate, getTestimonials);
router.post(
  "/",
  testimonialSubmissionLimiter,
  submitTestimonialValidation,
  validate,
  submitTestimonial
);
router.put(
  "/",
  testimonialSubmissionLimiter,
  updateTestimonialValidation,
  validate,
  updateTestimonial
);

export default router;
