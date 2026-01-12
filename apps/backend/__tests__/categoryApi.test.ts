import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";
import { sessionService } from "../src/services/sessionService";

describe("Category API", () => {
  let adminCookie: string;
  let createdCategoryId: string;

  beforeAll(async () => {
    // admin ユーザー作成
    const admin = await prisma.user.create({
      data: {
        handle: `admin_test_${Date.now()}`,
        name: "Admin Test",
        email: `admin_${Date.now()}@example.com`,
        passwordHash: "dummy",
        status: "active",
        role: "admin",
      },
      select: { id: true },
    });

    // ★ 生トークンを作成（DBへのhash保存も内部でやってくれる）
    const rawToken = await sessionService.createSession(admin.id);

    // ★ Cookie には生トークン
    adminCookie = `session_id=${rawToken}`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("GET /api/categories カテゴリ一覧を取得できる", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("POST /api/admin/categories 管理者はカテゴリを作成できる", async () => {
    const res = await request(app)
      .post("/api/admin/categories")
      .set("Cookie", adminCookie)
      .send({ name: "テストカテゴリ1" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("テストカテゴリ1");

    createdCategoryId = String(res.body.data.id);
  });

  test("POST /api/admin/categories 重複名はエラーになる", async () => {
    const res = await request(app)
      .post("/api/admin/categories")
      .set("Cookie", adminCookie)
      .send({ name: "テストカテゴリ1" });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.type).toBe("duplicate_error");
  });

  test("PUT /api/admin/categories/:id カテゴリ名を更新できる", async () => {
    const res = await request(app)
      .put(`/api/admin/categories/${createdCategoryId}`)
      .set("Cookie", adminCookie)
      .send({ name: "テストカテゴリ更新後" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("テストカテゴリ更新後");
  });

  test("PUT /api/admin/categories/:id 存在しないIDはエラー", async () => {
    const res = await request(app)
      .put("/api/admin/categories/999999")
      .set("Cookie", adminCookie)
      .send({ name: "存在しない" });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.type).toBe("not_found");
  });

  test("DELETE /api/admin/categories/:id カテゴリを削除できる", async () => {
    const res = await request(app)
      .delete(`/api/admin/categories/${createdCategoryId}`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // 実装によって返却形式が違う可能性があるので、ここは両対応にしておく
    const data = res.body.data;
    expect(data?.deleted === true || data?.message || data === null).toBeTruthy();
  });
});
