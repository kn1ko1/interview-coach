import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';

interface AuthenticatedRequest extends Request {
  userId?: string;
  email?: string;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);
  const decoded = AuthService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  req.email = decoded.email;
  next();
};

export default authenticate;