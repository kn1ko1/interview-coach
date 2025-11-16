import express, { Request, Response } from 'express';
import AuthService from '../services/authService';

const router = express.Router();

interface AuthRequest extends Request {
  body: {
    email: string;
  };
}

/**
 * POST /api/auth/login
 * Login or create user with email
 */
router.post('/login', (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const result = AuthService.loginOrCreateUser(email);

  if ('error' in result) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
});

/**
 * POST /api/auth/verify
 * Verify JWT token
 */
router.post('/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);
  const decoded = AuthService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  res.status(200).json({ valid: true, user: decoded });
});

export default router;