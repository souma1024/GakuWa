import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/lib/prisma";

describe("Article API", () => {
  let articleId: string;
  let categoryId: number;

   beforeAll(async () => {
  const category = await prisma.category.upsert({
    where: { name: "テスト用カテゴリ" },
    update: {},
    create: { name: "テスト用カテゴリ" },
  });

  categoryId = Number(category.id);
});

  afterAll(async () => {
    // テスト後にDB接続を閉じる
    await prisma.$disconnect();
  });

  test("POST /api/articles 記事を作成できる", async () => {
  const res = await request(app)
    .post("/api/articles")
    .send({
      title: "テスト記事",
      content: "本文",
      categoryId,
    });

  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);

  articleId = res.body.data.id; // ← string のまま保持
});


  test("GET /api/articles 記事一覧を取得できる", async () => {
    const res = await request(app).get("/api/articles");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /api/articles/:id 記事詳細を取得できる", async () => {
  const res = await request(app).get(`/api/articles/${articleId}`);

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.id).toBe(articleId);
  });
});
