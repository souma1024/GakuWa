import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/lib/prisma";

describe("Article CRUD API", () => {
  let userCookie: string;
  let articleId: bigint;
  let categoryId: bigint;

  beforeAll(async () => {
    // ===== ユーザ作成 =====
    const user = await prisma.user.create({
      data: {
        handle: `user_${Date.now()}`,
        name: "Test User",
        email: `user_${Date.now()}@test.com`,
        passwordHash: "dummy",
        role: "user",
        status: "active",
      },
    });

    // ===== セッション作成 =====
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: `token-${Date.now()}`,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    });

    userCookie = `session=${session.sessionToken}`;

    // ===== カテゴリ作成 =====
    const category = await prisma.category.create({
      data: {
        name: `category_${Date.now()}`,
      },
    });
    categoryId = category.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // =========================
  // 記事作成
  // =========================
  test("記事を作成できる", async () => {
    const res = await request(app)
      .post("/api/articles")
      .set("Cookie", userCookie)
      .send({
        title: "テスト記事",
        content: "本文",
        categoryId: Number(categoryId),
      });

    expect(res.status).toBe(201);


    articleId = BigInt(res.body.data.id);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });
    expect(article).not.toBeNull();
  });

  // =========================
  // 記事更新
  // =========================
  test("記事を更新できる", async () => {
    const res = await request(app)
      .put(`/api/articles/${articleId.toString()}`)
      .set("Cookie", userCookie)
      .send({
        title: "更新後タイトル",
        content: "更新後本文",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const updated = await prisma.article.findUnique({
      where: { id: articleId },
    });

    expect(updated?.title).toBe("更新後タイトル");
    expect(updated?.content).toBe("更新後本文");
  });

  // =========================
  // 記事削除
  // =========================
  test("記事を削除できる", async () => {
    const res = await request(app)
      .delete(`/api/articles/${articleId.toString()}`)
      .set("Cookie", userCookie);

    expect(res.status).toBe(204);

    const deleted = await prisma.article.findUnique({
      where: { id: articleId },
    });

    expect(deleted).toBeNull();
  });

  // =========================
  // 存在しない記事
  // =========================
  test("存在しない記事は404", async () => {
    const res = await request(app)
      .delete("/api/articles/999999")
      .set("Cookie", userCookie);

    expect(res.status).toBe(404);
  });
});
