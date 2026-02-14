import { GetArticleResponse, GetArticlesResponse } from "../dtos/articles/responseDtos";
import { ApiError } from "../errors/apiError";
import { articleRepository } from "../repositories/articleRepository";
import { userRepository } from "../repositories/userRepository";
import { CreateArticleInput } from "../types/articleSchema";
import { UpdateArticleInput } from "../types/articleSchema";
import { uuidGenerator } from "../utils/uuidGenerator";

export const articleService = {
  async createArticle(input: CreateArticleInput, userId: bigint){
    const handle: string = uuidGenerator() ;
    const article =  await articleRepository.create(input, userId, handle);

    if (!article) {
      throw new ApiError('database_error', '記事の新規登録に失敗しました');
    }

    const user = await userRepository.findById(article.authorId);

    if (!user) {
      throw new ApiError('database_error', 'ユーザー取得に失敗しました');
    }

    return {
      handle: user.handle
    };
  },

  async getPublishedArticles(authorId? :bigint) {
    const articles = await articleRepository.findPublishedArticles(authorId);

    const response = articles.map(article => ({
      handle: article.handle,
      title: article.title,
      likes_count: article.likesCount.toString(),
      author: article.author.handle,
      author_avatarUrl: article.author.avatarUrl,
      tag_names: article.articleTags,
      updated_at: article.updatedAt,
    }));

    return response;
  },

  async getAllArticlesById(id: bigint) {
    const articles = await articleRepository.findAllArticles(id);

    const response = articles.map(article => ({
      handle: article.handle,
      title: article.title,
      likes_count: article.likesCount.toString(),
      author: article.author.handle,
      author_avatarUrl: article.author.avatarUrl,
      tag_names: article.articleTags,
      updated_at: article.updatedAt,
      status: article.status
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
      content: article.contentMd,
      status: article.status,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt
    }
  },

  async getArticleByHandle(handle: string) {
    const article = await articleRepository.findByHandle(handle);

    if(!article) {
      throw new ApiError('database_error', '記事の取得に失敗しました');
    } 

    return { article };
  },

  async updateArticle(id: bigint, data: UpdateArticleInput) {
    const updatedArticle = await articleRepository.updateById(id, data);
    
    if (!updatedArticle) {
      throw new ApiError('database_error', '記事の更新に失敗しました');
    }
    return {
      id: updatedArticle.id.toString(),
      title: updatedArticle.title,
      content: updatedArticle.contentMd,
      status: updatedArticle.status,
      updatedAt: updatedArticle.updatedAt,
    };
  },

   async publishArticle(handle: string) {
    const article = await articleRepository.findByHandle(handle);

    if (!article) {
      throw new ApiError('not_found', 'article not found');
    }

    if (article.status === "published") {
      throw new ApiError('forbidden', 'already_published');
    }

    const publishedArticle = await articleRepository.publishByHandle(handle);

    if (!publishedArticle) {
      throw new ApiError('database_error', '記事の公開に失敗しました');
    }

    return {
      handle: publishedArticle.handle,
      status: publishedArticle.status,
      updatedAt: publishedArticle.updatedAt,
    }
  },

  async deleteArticle(id: bigint) {
    const deleted = await articleRepository.deleteById(id);
    if (!deleted) {
      throw new ApiError("not_found", "記事が存在しません");
    }
  },
};
