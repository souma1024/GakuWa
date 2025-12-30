import { CreateArticleResponse, GetArticleResponse, GetArticlesResponse } from "../dtos/articles/responseDtos";
import { ApiError } from "../errors/apiError";
import { articleRepository } from "../repositories/articleRepository";
import { CreateArticleInput } from "../types/articleSchema";
import { UpdateArticleInput } from "../types/articleSchema";

export const articleService = {
  async createArticle(input: CreateArticleInput): Promise<CreateArticleResponse> {
    const article =  await articleRepository.create(input);

    if (!article) {
      throw new ApiError('database_error', '記事の新規登録に失敗しました');
    }

    return {
      id: article.id.toString(),
      title: article.title,
      status: article.status,
      createdAt: article.createdAt
    };
  },

  async getArticlesByStatus(status: string): Promise<GetArticlesResponse[]> {
    const articles = await articleRepository.findArticlesByStatus(status);

    if (!articles) {
      throw new ApiError('database_error', '記事の取得に失敗しました');
    }

    if (articles.length) {
      throw new ApiError('not_found', '記事が見つかりません');
    }

    const response: GetArticlesResponse[] = articles.map(article => ({
      id: article.id.toString(),
      title: article.title,
      status: article.status,
      createdAt: article.createdAt
    }));

    return response;
  },
  async getArticleById(id: bigint): Promise<GetArticleResponse> {
    const article = await articleRepository.findById(id);

    if (!article) {
      throw new ApiError('not_found', '該当の記事が見つかりません');
    }

    return  {
      id: article.id.toString(),
      title: article.title,
      content: article.content,
      status: article.status,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt
    }
  },

  async updateArticle(id: bigint, data: UpdateArticleInput) {
    const updatedArticle = await articleRepository.updateById(id, data);
    
    if (!updatedArticle) {
      throw new ApiError('database_error', '記事の更新に失敗しました');
    }
    return {
      id: updatedArticle.id.toString(),
      title: updatedArticle.title,
      content: updatedArticle.content,
      status: updatedArticle.status,
      updatedAt: updatedArticle.updatedAt,
    };
  },

   async publishArticle(id: bigint) {
    const article = await articleRepository.findById(id);

    if (!article) {
      throw new ApiError('not_found', 'article not found');
    }

    if (article.status === "published") {
      throw new ApiError('forbidden', 'already_published');
    }

    const pulishedArticle = await articleRepository.publishById(id);

    if (!pulishedArticle) {
      throw new ApiError('database_error', '記事の公開に失敗しました');
    }

    return {
      id: article.id.toString(),
      status: article.status,
      updatedAt: article.updatedAt,
    }
  },

  async deleteArticle(id: bigint) {
    const deletedArticle = await articleRepository.deleteById(id);

    if (!deletedArticle) {
      throw new ApiError('not_found', 'article not found');
    }
  },
};
