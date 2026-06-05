import rateLimit from "express-rate-limit";

// Rate limiting for password reset and OTP verifications 
// Limits each IP to 5 OTP attempts per 15 minutes
export const otpActionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        success: false,
        message: "Too many attempts from this IP, please try again after 15 minutes"
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});


// General rate limiting for API endpoints to protect against brute-force and scraping
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes"
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

// Strict rate limit for authentication (login/register) to prevent brute-forcing
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 attempts
    message: {
        success: false,
        message: "Too many login or registration attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Dedicated rate limiting for resource-intensive image processing requests
export const processingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 image processing runs
    message: {
        success: false,
        message: "Too many image processing requests. Please wait 15 minutes before trying again."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
