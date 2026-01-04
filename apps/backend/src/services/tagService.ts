import { prisma } from "../lib/prisma";
import { ApiError } from "../errors/apiError";

export const tagService = {
  async createTag(name: string) {
    if (!name || typeof name !== "string") {
      throw new ApiError("validation_error", "タグ名は必須です");
    }

    // ① 既存タグ確認
    const existing = await prisma.tag.findUnique({
      where: { name },
    });

    if (existing) {
      return existing;
    }

    // ② 新規作成
    return await prisma.tag.create({
      data: { name },
    });
  },
};
