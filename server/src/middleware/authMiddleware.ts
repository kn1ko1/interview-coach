import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.slice(7);

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    req.userId = decoded.userId;
    req.email = decoded.email;

    next();
  } catch (err: Error | any) {
    console.error('Auth middleware error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default authenticate;