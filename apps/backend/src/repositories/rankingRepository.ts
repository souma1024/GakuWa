import { prisma } from '../lib/prisma';

type UserArticleRanking = {
  id: bigint;
  handle: string;
  avatarUrl: string | null;
  articles_count: bigint;
};

export const rankingRepositoy = {
  async postsRanking() {
    const ranking = await prisma.$queryRaw<UserArticleRanking[]>`
      SELECT
        u.id,
        u.handle,
        u.avatar_url AS avatarUrl,
        COALESCE(a._count, 0) AS articles_count
      FROM users u
      LEFT JOIN (
        SELECT
          author_id,
          COUNT(*) AS _count
        FROM articles
        WHERE status = 'published'
        GROUP BY author_id
      ) a
      ON u.id = a.author_id
      ORDER BY articles_count DESC
      LIMIT 10
    `;
    return ranking;
  }
}