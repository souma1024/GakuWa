import { PrismaClient, Prisma, ArticleStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const articleRepository = {
  /**
   * キーワード検索 (公開済みの記事のみを対象とする例)
   */
  async findManyByKeyword(keyword: string, skip: number, take: number) {
    // 検索条件: 公開済み(published) かつ (タイトル OR 本文にキーワードが含まれる)
    const whereCondition: Prisma.ArticleWhereInput = {
      status: ArticleStatus.published, // 公開済みのみ
      AND: keyword
        ? {
            OR: [
              { title: { contains: keyword } },
              { contentMd: { contains: keyword } }, // 本文(Markdown)を検索
            ],
          }
        : {},
    };

    // トランザクションで一覧と総数を取得
    const [articles, totalCount] = await prisma.article.findMany{
        where: whereCondition,
        skip: skip,
        take: take,
        orderBy: { publishedAt: 'desc' }, // 公開日順
        include: {
          author: {
            select: {
              name: true,
              handle: true,
              avatarUrl: true,
            },
          },
        },
      }),
    };

    return { articles, totalCount };
  },
};