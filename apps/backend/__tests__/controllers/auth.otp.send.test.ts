import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/prisma";

describe("POST /api/auth/otp/send", () => {
  let publicToken: string;
  let userId: bigint;

  beforeAll(async () => {
    // ① テスト用 User 作成
    const user = await prisma.user.create({
      data: {
        handle: "otp_test_user",
        name: "OTP Test User",
        email: "otp-test@example.com",
        passwordHash: "dummy",
        status: "active",
      },
    });

    userId = user.id;

    // ② テスト用 EmailOtp 作成
    const emailOtp = await prisma.emailOtp.create({
      data: {
        userId,
        publicToken: "test-public-token-123",
        codeHash: "dummy",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        purpose: "signup",
      },
    });

    publicToken = emailOtp.publicToken;
  });

  afterAll(async () => {
    // 後片付け
    await prisma.emailOtp.deleteMany({
      where: { publicToken },
    });
    await prisma.user.delete({
      where: { id: userId },
    });

    await prisma.$disconnect();
  });

  it("OTP再送に成功する", async () => {
    const res = await request(app)
      .post("/api/auth/otp/send")
      .send({
        public_token: publicToken,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe("メール送信に成功しました");
  });

  it("public_token が無い場合は validation_error", async () => {
    const res = await request(app)
      .post("/api/auth/otp/send")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.type).toBe("validation_error");
  });

  it("存在しない public_token は not_found", async () => {
    const res = await request(app)
      .post("/api/auth/otp/send")
      .send({
        public_token: "not-exists-token",
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.type).toBe("not_found");
  });
});
