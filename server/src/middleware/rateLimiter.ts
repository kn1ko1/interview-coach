import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate limiting configuration for authentication endpoints
 * Prevents brute force attacks and bot/AI automated logins
 * Uses in-memory store (upgrade to Redis in production)
 */

/**
 * Strict rate limiter for login attempts
 * - Max 5 attempts per email per 15 minutes
 * - Prevents credential stuffing and bot attacks
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use email from request body as key for better accuracy
    const email = ((req.body as any)?.email || req.ip || 'unknown').toLowerCase();
    return email;
  },
  skip: (req: Request) => {
    // Don't rate limit internal/development IPs if needed
    return false;
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many login attempts',
      message: 'Please try again after 15 minutes.',
    });
  },
});

/**
 * Strict rate limiter for registration endpoints
 * - Max 3 registrations per IP per hour
 * - Prevents spam accounts
 */
export const registrationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: 'Too many registration attempts. Please try again after 1 hour.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many registration attempts',
      retryAfter: new Date(Date.now() + 60 * 60 * 1000),
    });
  },
});

/**
 * Password reset rate limiter
 * - Max 3 attempts per email per hour
 * - Prevents email bombing and account enumeration
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  keyGenerator: (req: Request) => {
    const email = ((req.body as any)?.email || req.ip || 'unknown').toLowerCase();
    return email;
  },
  message: 'Too many password reset requests. Please try again after 1 hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  loginRateLimiter,
  registrationRateLimiter,
  passwordResetRateLimiter,
};
