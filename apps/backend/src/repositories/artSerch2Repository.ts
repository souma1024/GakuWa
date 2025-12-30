import { prisma } from '../lib/prisma'; 
import { Prisma } from '@prisma/client';

// --- 型定義 ---

// フロントエンドに返す記事データの型
export interface Article {
  id: number;           // JSで扱いやすいようにnumberに変換します
  handle: string;
  authorId: number;     // JSで扱いやすいようにnumberに変換します
  title: string;
  contentMd: string;
  contentHtml: string;
  likesCount: number;
  bookmarksCount: number; // ★スキーマに合わせて追加
  viewsCount: number;     // ★スキーマに合わせて追加
  status: 'draft' | 'published' | 'archived';
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;        // ★スキーマに合わせて追加
}

// 検索条件の型
export type ArtSearch2RepositoryParams = {
  offset: number;
  limit: number;
  keywords: string[];
  status: 'published';
};

// 戻り値の型
export type SearchResult = {
  articles: Article[];
  totalCount: number;
};

// インターフェース
export interface IArticleRepository {
  find(params: ArtSearch2RepositoryParams): Promise<SearchResult>;
}

// --- クラス実装 (Prisma版) ---

export class PrismaArticleRepository implements IArticleRepository {
  
  async find(params: ArtSearch2RepositoryParams): Promise<SearchResult> {
    
    // 1. 検索条件（WHERE句）の作成
    const whereConditions: Prisma.ArticleWhereInput = {
      status: 'published',
    };

    // キーワード検索（タイトル OR 本文）
    if (params.keywords.length > 0) {
      whereConditions.AND = params.keywords.map((word) => ({
        OR: [
          { title: { contains: word } },
          { contentMd: { contains: word } } // スキーマの @map("content_md") はPrismaが自動で処理してくれます
        ],
      }));
    }

    try {
      // 2. データ取得とカウントを実行
      const [totalCount, prismaArticles] = await prisma.$transaction([
        prisma.articles.count({ where: whereConditions }),
        prisma.articles.findMany({
          where: whereConditions,
          take: params.limit,
          skip: params.offset,
          orderBy: { publishedAt: 'desc' },
        }),
      ]);

      // 3. 型変換 (PrismaのBigInt → number)
      // schema.prismaで id BigInt となっているため、変換しないとJSON送信時にクラッシュします
      const formattedArticles: Article[] = prismaArticles.map((a:any) => ({
        id: Number(a.id),
        handle: a.handle,
        authorId: Number(a.authorId),
        title: a.title,
        contentMd: a.contentMd,
        contentHtml: a.contentHtml,
        likesCount: a.likesCount,
        bookmarksCount: a.bookmarksCount, // ★追加
        viewsCount: a.viewsCount,         // ★追加
        status: a.status as 'draft' | 'published' | 'archived',
        publishedAt: a.publishedAt,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt            // ★追加
      }));

      return {
        articles: formattedArticles,
        totalCount: totalCount,
      };

    } catch (error) {
      console.error('Prisma Error:', error);
      return { articles: [], totalCount: 0 };
    }
  }
}