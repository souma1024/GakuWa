import { prisma } from "../lib/prisma";

export const adminTagRepository = {
  findById(tagId: number) {
    return prisma.tag.findUnique({
      where: { id: tagId },
    });
  },

  async isTagUsed(tagId: number): Promise<boolean> {
    const count = await prisma.articleTag.count({
      where: {
        tagId: tagId,
      },
    });

    return count > 0;
  },

  delete(tagId: number) {
    return prisma.tag.delete({
      where: { id: tagId },
    });
  },
};
