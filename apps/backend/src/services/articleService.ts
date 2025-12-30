import { articleRepository } from "../repositories/articleRepository";
import { CreateArticleInput } from "../types/articleSchema";
import { UpdateArticleInput } from "../types/articleSchema";

export const articleService = {
  async createArticle(input: CreateArticleInput) {
    return articleRepository.create(input);
  },
  async getArticlesByStatus(status: string) {
    return articleRepository.findByStatus(status);
  },
  async getArticleById(id: bigint) {
    return articleRepository.findById(id);
  },
  async updateArticle(id: bigint, data: UpdateArticleInput) {
    return articleRepository.updateById(id, data);
  },
   async publishArticle(id: bigint) {
    const article = await articleRepository.findById(id);
    if (!article) {
      return null;
    }
    if (article.status === "published") {
      throw new Error("already_published");
    }
    return articleRepository.publishById(id);
  },
  async deleteArticle(id: bigint) {
    return articleRepository.deleteById(id);
  },
};
