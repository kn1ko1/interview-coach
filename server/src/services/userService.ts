/* eslint-disable @typescript-eslint/no-var-requires */
import bcrypt from "bcrypt";

let UserModel: any;
try {
  // Prefer an explicit User model if present
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  UserModel = require("../models/user").default;
} catch {
  // Fallback to Candidate model if no User model exists
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  UserModel = require("../models/candidate").default;
}

export interface UserData {
  email: string;
  password: string;
  [key: string]: unknown;
}

export class UserService {
  /**
   * Create a new user (placeholder implementation).
   * Replace with real DB logic, validation and password hashing.
   */
    public async createUser(userData: UserData): Promise<unknown> {
    if (!userData || !userData.email) {
      throw new Error('Missing required user data (email).');
    }

    // NOTE: do NOT return the password. This is a minimal stub.
    const { password, ...safe } = userData as any;

    // Simulate created user
    return {
      id: `user_${Date.now()}`,
      ...safe,
    };
  }

  /**
   * Authenticate a user (placeholder).
   * Replace with real authentication: lookup user, compare hashed password, etc.
   */
   public async authenticateUser(email: string, password: string): Promise<unknown | null> {
    if (!email || !password) return null;
    // Development stub: accept any non-empty credentials.
    return {
      id: `user_${Date.now()}`,
      email,
    };
  }
}

export async function findUserByEmail(email: string) {
  return UserModel.findOne({ email }).lean();
}

export async function createUser(payload: Record<string, any>) {
  if (payload.password) {
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);
  }
  return UserModel.create(payload);
}

export async function comparePassword(user: any, candidatePassword: string) {
  if (!user || !user.password) return false;
  return bcrypt.compare(candidatePassword, user.password);
}