import jwt from 'jsonwebtoken';
import crypto from 'crypto';

interface User {
  id: string;
  email: string;
  createdAt: Date;
}

interface AuthToken {
  token: string;
  expiresIn: string;
  user: User;
}

export class AuthService {
  private static jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-me';
  private static tokenExpiry = '7d';

  /**
   * Generate a unique user ID based on email
   */
  static generateUserId(email: string): string {
    return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 16);
  }

  /**
   * Generate JWT token for user
   */
  static generateToken(email: string): AuthToken {
    const userId = this.generateUserId(email);
    const user: User = {
      id: userId,
      email: email.toLowerCase(),
      createdAt: new Date(),
    };

    const token = jwt.sign(
      { userId, email: user.email },
      this.jwtSecret,
      { expiresIn: this.tokenExpiry }
    );

    return {
      token,
      expiresIn: this.tokenExpiry,
      user,
    };
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as {
        userId: string;
        email: string;
      };
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Login or create user with email
   */
  static loginOrCreateUser(email: string): AuthToken | { error: string } {
    if (!this.validateEmail(email)) {
      return { error: 'Invalid email format' };
    }

    return this.generateToken(email);
  }
}

export default AuthService;