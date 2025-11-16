/* eslint-disable @typescript-eslint/no-var-requires */
import crypto from 'crypto';
import db from '../db/schema';

export interface UserData {
  email: string;
  password?: string;
  [key: string]: unknown;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export class UserService {
  /**
   * Create or get user by email (for JWT auth without password)
   */
  public static async createOrGetUser(email: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // First, try to find existing user
      db.get('SELECT * FROM users WHERE email = ?', [email], (err: Error | null, row: User | undefined) => {
        if (err) {
          reject(err);
          return;
        }

        if (row) {
          // User exists
          resolve(row);
          return;
        }

        // User doesn't exist, create new one
        const userId = crypto.randomBytes(8).toString('hex');
        const now = new Date().toISOString();

        db.run(
          'INSERT INTO users (id, email, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
          [userId, email, now, now],
          (err: Error | null) => {
            if (err) {
              reject(err);
              return;
            }

            resolve({
              id: userId,
              email,
              createdAt: now,
              updatedAt: now,
            });
          }
        );
      });
    });
  }

  /**
   * Get user by ID
   */
  public static async getUserById(userId: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [userId], (err: Error | null, row: User | undefined) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row || null);
      });
    });
  }

  /**
   * Create a new user with password (legacy - for password-based auth)
   */
  public async createUser(userData: UserData): Promise<User> {
    if (!userData.email) {
      throw new Error('Missing required user data (email).');
    }

    const userId = crypto.randomBytes(8).toString('hex');
    const now = new Date().toISOString();

    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (id, email, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
        [userId, userData.email, now, now],
        (err: Error | null) => {
          if (err) {
            reject(err);
            return;
          }

          resolve({
            id: userId,
            email: userData.email,
            createdAt: now,
            updatedAt: now,
          });
        }
      );
    });
  }

  /**
   * Authenticate a user (placeholder).
   * Replace with real authentication: lookup user, compare hashed password, etc.
   */
  public async authenticateUser(email: string, password: string): Promise<User | null> {
    if (!email || !password) return null;

    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err: Error | null, row: User | undefined) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row || null);
      });
    });
  }
}

/**
 * Standalone functions (legacy)
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  return UserService.getUserById(email).catch(() => null);
}

export async function createUser(payload: UserData): Promise<User> {
  const service = new UserService();
  return service.createUser(payload);
}