import request from "supertest";
import app from "../../../src/app";
import { prisma } from "../../../src/lib/prisma";

describe("Tag CRUD API", () => {
  let userCookie: string;
  let adminCookie: string;
  let tagId: number;

  beforeAll(async () => {
    // ===== 一般ユーザー作成 =====
    const user = await prisma.user.create({
      data: {
        handle: `user_${Date.now()}`,
        name: "User",
        email: `user_${Date.now()}@example.com`,
        passwordHash: "dummy",
        status: "active",
      },
    });

    const admin = await prisma.user.create({
      data: {
        handle: `admin_${Date.now()}`,
        name: "Admin",
        email: `admin_${Date.now()}@example.com`,
        passwordHash: "dummy",
        role: "admin",
        status: "active",
      },
    });

    // セッション作成（Cookie取得）
    const userSession = await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: `user-session-${Date.now()}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const adminSession = await prisma.userSession.create({
      data: {
        userId: admin.id,
        sessionToken: `admin-session-${Date.now()}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    userCookie = `session_id=${userSession.sessionToken}`;
adminCookie = `session_id=${adminSession.sessionToken}`;

  });

  afterAll(async () => {
    await prisma.tag.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // ===============================
  // タグ作成（ユーザー）
  // ===============================
  test("POST /api/tags タグを作成できる", async () => {
    const res = await request(app)
      .post("/api/tags")
      .set("Cookie", userCookie)
      .send({ name: "TypeScript" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("TypeScript");

    tagId = res.body.data.id;
  });

  test("POST /api/tags 同名タグは再利用される", async () => {
    const res = await request(app)
      .post("/api/tags")
      .set("Cookie", userCookie)
      .send({ name: "TypeScript" });

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(tagId);
  });

  // ===============================
  // タグ更新（管理者）
  // ===============================
  test("PUT /api/admin/tags/:id 管理者はタグを更新できる", async () => {
    const res = await request(app)
      .put(`/api/admin/tags/${tagId}`)
      .set("Cookie", adminCookie)
      .send({ name: "JavaScript" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("JavaScript");
  });

  test("PUT /api/admin/tags/:id 一般ユーザーは更新できない", async () => {
    const res = await request(app)
      .put(`/api/admin/tags/${tagId}`)
      .set("Cookie", userCookie)
      .send({ name: "NG" });

    expect(res.status).toBe(403);
  });

  // ===============================
  // タグ削除（管理者）
  // ===============================
  test("DELETE /api/admin/tags/:id 管理者はタグを削除できる", async () => {
    const res = await request(app)
      .delete(`/api/admin/tags/${tagId}`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("DELETE /api/admin/tags/:id 存在しないタグは404", async () => {
    const res = await request(app)
      .delete(`/api/admin/tags/999999`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(404);
  });
});
