import { userRepository } from "../repositories/userRepository";
import { sessionRepository } from "../repositories/sessionRepository";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7日
const OTP_EXPIRES_MS = 1000 * 60 * 10; // 10分

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authService = {
  // =========================
  // ログイン
  // =========================
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await sessionRepository.createSession({
      userId: user.id,
      sessionToken,
      expiresAt,
    });

    return { sessionToken, expiresAt };
  },

  // =========================
  // OTP 再送
  // =========================
  async sendOtp(publicToken: string) {
    const emailOtp = await prisma.emailOtp.findUnique({
      where: { publicToken },
      include: { user: true },
    });

    if (!emailOtp) {
      const err: any = new Error("OTP not found");
      err.type = "not_found";
      throw err;
    }

    const otp = generateOtp();
    const codeHash = await bcrypt.hash(otp, 10);

    await prisma.emailOtp.update({
      where: { id: emailOtp.id },
      data: {
        codeHash,
        expiresAt: new Date(Date.now() + OTP_EXPIRES_MS),
        attempts: 0,
        usedAt: null,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: emailOtp.user.email,
      subject: "ワンタイムパスワード",
      text: `あなたのOTPは ${otp} です`,
    });
  },
};
