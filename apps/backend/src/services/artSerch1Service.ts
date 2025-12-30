import { articleRepository } from '../repositories/artSerch1Repository';

// BigInt対策 & 整形
const serialize = (article: any) => ({
  id: article.id.toString(),
  handle: article.handle,
  title: article.title,
  // 検索結果用に本文(Markdown)の先頭100文字を抜粋
  summary: article.contentMd.substring(0, 100) + '...', 
  likesCount: article.likesCount,
  viewsCount: article.viewsCount,
  publishedAt: article.publishedAt,
  author: {
    name: article.author.name,
    handle: article.author.handle,
    avatarUrl: article.author.avatarUrl
  }
});

export const articleService = {
  async searchArticles(q: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { articles, totalCount } = await articleRepository.findManyByKeyword(q, skip, limit);
    return {
      articles: articles.map(serialize),
      meta: { totalCount, currentPage: page, totalPages: Math.ceil(totalCount / limit) }
    };
  }
};