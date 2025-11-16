import jwt, { SignOptions } from 'jsonwebtoken';

export class AuthService {
  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate JWT token
   */
  static generateToken(payload: { userId: string; email: string }, secret: string, expiresIn: string | number = '7d'): string {
    const options: SignOptions = {
      expiresIn: expiresIn as any,
      algorithm: 'HS256',
    };

    return jwt.sign(payload, secret, options);
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string, secret: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, secret) as { userId: string; email: string };
      return decoded;
    } catch (err) {
      console.error('Token verification failed:', err);
      return null;
    }
  }
}