import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Email Verification Service
 * Sends verification codes to email addresses to prevent:
 * - Fake account creation
 * - Account enumeration attacks
 * - Credential stuffing with fake emails
 */

// In-memory store for verification codes (use Redis in production)
const verificationCodes = new Map<string, {
  code: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}>();

const MAX_ATTEMPTS = 3;
const CODE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const CODE_LENGTH = 6;

/**
 * Generate a random verification code
 */
function generateVerificationCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Store verification code in memory/cache
 * In production, use Redis or database
 */
export function storeVerificationCode(email: string): { code: string; expiresAt: number } {
  const code = generateVerificationCode();
  const expiresAt = Date.now() + CODE_EXPIRY_MS;

  verificationCodes.set(email, {
    code,
    expiresAt,
    attempts: 0,
    createdAt: Date.now(),
  });

  // Auto-cleanup after expiry
  setTimeout(() => {
    verificationCodes.delete(email);
  }, CODE_EXPIRY_MS);

  return { code, expiresAt };
}

/**
 * Verify the code provided by user
 */
export function verifyCode(email: string, code: string): boolean {
  const stored = verificationCodes.get(email);

  if (!stored) {
    return false;
  }

  // Check if expired
  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(email);
    return false;
  }

  // Check attempt limit
  if (stored.attempts >= MAX_ATTEMPTS) {
    verificationCodes.delete(email);
    return false;
  }

  // Increment attempts
  stored.attempts++;

  // Check code
  if (stored.code === code) {
    verificationCodes.delete(email);
    return true;
  }

  return false;
}

/**
 * Check if email already has pending verification
 */
export function hasPendingVerification(email: string): boolean {
  return verificationCodes.has(email);
}

/**
 * Get remaining attempts for verification code
 */
export function getRemainingAttempts(email: string): number {
  const stored = verificationCodes.get(email);
  if (!stored || Date.now() > stored.expiresAt) {
    return 0;
  }
  return MAX_ATTEMPTS - stored.attempts;
}

/**
 * Middleware to check email verification before registration
 */
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction): void => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    res.status(400).json({
      error: 'Email and verification code required',
    });
    return;
  }

  if (!verifyCode(email, verificationCode)) {
    const remaining = getRemainingAttempts(email);
    
    if (remaining === 0) {
      res.status(429).json({
        error: 'Too many failed verification attempts',
        message: 'Request a new verification code',
      });
      return;
    }

    res.status(400).json({
      error: 'Invalid verification code',
      remaining,
    });
    return;
  }

  next();
};

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Detect disposable email addresses (optional but recommended)
 * In production, use a service like disposable-email-domains
 */
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'throwaway.email',
  'mailinator.com',
  'yopmail.com',
];

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain || '');
}

export default {
  generateVerificationCode,
  storeVerificationCode,
  verifyCode,
  hasPendingVerification,
  getRemainingAttempts,
  requireEmailVerification,
  isValidEmail,
  isDisposableEmail,
};
