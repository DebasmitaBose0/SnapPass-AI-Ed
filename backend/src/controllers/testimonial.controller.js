import catchAsync from "../utils/catchAsync.js";
import * as testimonialService from "../service/testimonial.service.js";

const sendSuccess = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const getTestimonials = catchAsync(async (req, res) => {
  const clientFingerprint =
    req.query.fingerprint || req.headers["x-client-fingerprint"] || null;
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  const data = await testimonialService.getApprovedTestimonials(clientFingerprint, { page, limit });

  sendSuccess(res, 200, "Testimonials fetched successfully", data);
});

export const submitTestimonial = catchAsync(async (req, res) => {
  const submitterIp = testimonialService.getClientIp(req);
  const testimonial = await testimonialService.submitTestimonial(
    req.body,
    submitterIp
  );

  sendSuccess(res, 201, "Review submitted successfully", { testimonial });
});

export const updateTestimonial = catchAsync(async (req, res) => {
  const submitterIp = testimonialService.getClientIp(req);
  const testimonial = await testimonialService.updateUserTestimonial(
    req.body,
    submitterIp
  );

  sendSuccess(res, 200, "Review updated successfully", { testimonial });
});
