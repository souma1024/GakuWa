import { articleRepository } from "../repositories/articleRepository";
import { CreateArticleInput } from "../types/articleSchema";

export const articleService = {
  async createArticle(input: CreateArticleInput) {
    return articleRepository.create(input);
  },

  async getArticlesByStatus(status: string) {
    return articleRepository.findByStatus(status);
  },
};
