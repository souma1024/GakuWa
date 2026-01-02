import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("GET /api/suggest", () => {
  beforeAll(async () => {
    // ===== テスト用カテゴリ作成 =====
    await prisma.category.createMany({
      data: [
        { name: "学習" },
        { name: "学しゅう" },
        { name: "学問" },
        { name: "学校" },
        { name: "学部" },
        { name: "数学" },
      ],
      skipDuplicates: true,
    });

    // ===== テスト用タグ作成 =====
    await prisma.tag.createMany({
      data: [
        { name: "React" },
        { name: "Redux" },
        { name: "Recoil" },
        { name: "Next.js" },
      ],
      skipDuplicates: true,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ==============================
  // 正常系
  // ==============================

  test("category: 日本語キーワードでサジェストできる", async () => {
    const res = await request(app).get(
      "/api/suggest?type=category&keyword=%E5%AD%A6&limit=5"
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(5);

    // 返却要素の形
    expect(res.body.data[0]).toHaveProperty("id");
    expect(res.body.data[0]).toHaveProperty("name");
  });

  test("tag: 英字キーワードでサジェストできる", async () => {
    const res = await request(app).get(
      "/api/suggest?type=tag&keyword=Re&limit=5"
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("limit を超えるデータがあっても最大5件まで", async () => {
    const res = await request(app).get(
      "/api/suggest?type=category&keyword=%E5%AD%A6"
    );

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });

  // ==============================
  // 異常系
  // ==============================

  test("keyword 未指定の場合は 400", async () => {
    const res = await request(app).get("/api/suggest?type=category");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("type 不正の場合は 400", async () => {
    const res = await request(app).get(
      "/api/suggest?type=invalid&keyword=学"
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("limit が 5 を超える場合は 400", async () => {
    const res = await request(app).get(
      "/api/suggest?type=category&keyword=学&limit=10"
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
