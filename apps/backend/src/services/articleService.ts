import { articleRepository } from "../repositories/articleRepository";
import { CreateArticleInput } from "../types/articleSchema";

export const articleService = {
  async createArticle(input: CreateArticleInput) {
    // 将来ここに
    // ・ログインユーザーID付与
    // ・status制御
    // を書ける

    return articleRepository.create(input);
  },
};
