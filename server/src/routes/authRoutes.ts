import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import { EmailService } from '../services/emailService';
import { loginRateLimiter, registrationRateLimiter } from '../middleware/rateLimiter';
import { detectBotActivity, blockObviousBots } from '../middleware/botDetection';
import { storeVerificationCode, verifyCode, isValidEmail, isDisposableEmail } from '../middleware/emailVerification';

const router = express.Router();

interface AuthRequest extends Request {
  body: {
    email: string;
    token?: string;
  };
}

// Get JWT secret from environment - MUST be set in production
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. This is required for authentication.');
}
const JWT_EXPIRY = '7d';

/**
 * POST /api/auth/login
 * Send login email with token
 * Protected by rate limiting and bot detection
 */
router.post('/login', blockObviousBots, detectBotActivity, loginRateLimiter, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Check for disposable email (optional)
    if (isDisposableEmail(email)) {
      console.warn(`[SECURITY] Disposable email login attempt: ${email}`);
      // You can either block it or just log it
      // res.status(400).json({ error: 'Disposable email addresses not allowed' });
      // return;
    }

    // Check if bot activity was detected - log but don't block automatically
    if ((req as any).isSuspiciousActivity) {
      console.warn(`[BOT-CHECK] Suspicious login attempt from ${email}`);
      // Add to monitoring system in production
    }

    // Create or get user
    const user = await UserService.createOrGetUser(email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Simulate email send (logs to file)
    await EmailService.sendLoginEmail(email, token);

    res.status(200).json({
      message: 'Login email sent',
      user,
      // For testing: include token in response (remove in production)
      testToken: process.env.NODE_ENV === 'development' ? token : undefined,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/verify
 * Verify JWT token
 */
router.post('/verify', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    const authHeader = req.headers.authorization;

    const tokenToVerify = token || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

    if (!tokenToVerify) {
      res.status(401).json({ error: 'Token is required' });
      return;
    }

    // Verify JWT
    const decoded = jwt.verify(tokenToVerify, JWT_SECRET) as { userId: string; email: string };

    // Get user
    const user = await UserService.getUserById(decoded.userId);

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      valid: true,
      user,
      token: tokenToVerify,
    });
  } catch (err: Error | any) {
    console.error('Verify error:', err);
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    res.status(500).json({ error: 'Verification failed' });
  }
});

/**
 * POST /api/auth/logout
 * Logout (JWT is stateless, but we can invalidate on client)
 */
router.post('/logout', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

/**
 * GET /api/auth/emails (for testing only - remove in production)
 * Get all email logs
 */
router.get('/emails', async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') {
    res.status(403).json({ error: 'Not available in production' });
    return;
  }

  try {
    const emails = await EmailService.getEmailLogs();
    res.status(200).json(emails);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get email logs' });
  }
});

/**
 * GET /api/auth/latest-email (for testing only - remove in production)
 * Get latest email with token
 */
router.get('/latest-email', async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') {
    res.status(403).json({ error: 'Not available in production' });
    return;
  }

  try {
    const email = await EmailService.getLatestEmail();
    if (!email) {
      res.status(404).json({ error: 'No emails found' });
      return;
    }
    res.status(200).json(email);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get email' });
  }
});

export default router;