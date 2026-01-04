import { prisma } from "../lib/prisma";
import { ApiError } from "../errors/apiError";

export const tagService = {
  async findOrCreate(name: string) {
    const existing = await prisma.tag.findUnique({ where: { name } });
    if (existing) return existing;

    return prisma.tag.create({
      data: { name },
    });
  },

  async update(tagId: number, name: string) {
    const tag = await prisma.tag.findUnique({ where: { id: tagId } });
    if (!tag) {
      throw new ApiError("not_found", "タグが存在しません");
    }

    const duplicate = await prisma.tag.findUnique({ where: { name } });
    if (duplicate && duplicate.id !== tagId) {
      throw new ApiError("validation_error", "同名タグが既に存在します");
    }

    return prisma.tag.update({
      where: { id: tagId },
      data: { name },
    });
  },
};
