import { userRepository } from "../repositories/userRepository";
import { sessionRepository } from "../repositories/sessionRepository";
import crypto from "crypto";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7日

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    const session = await sessionRepository.createSession({
      userId: user.id,
      sessionToken,
      expiresAt,
    });

    return { sessionToken, expiresAt };
  },
};