import { prisma } from '../lib/prisma';

export const rankingRepositoy = {
  async postsRanking() {
    const ranking = await prisma.user.findMany({
      select: {
        id: true,
        handle: true,
        avatarUrl: true,
        _count: {
          select: {
            articles: {
              where: {
                status: 'published',
              },
            },
          },
        },
      },
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
      take: 10,
    });
    return ranking;
  }
}