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