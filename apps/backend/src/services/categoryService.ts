import { categoryRepository } from "../repositories/categoryRepository";
import { ApiError } from "../errors/apiError";

export const categoryService = {
  list: async () => {
    return categoryRepository.findAll();
  },

  create: async (name: string) => {
    const exists = await categoryRepository.findByName(name);
    if (exists) {
      throw new ApiError(
        "duplicate_error",
        "同じカテゴリ名が既に存在します"
      );
    }
    return categoryRepository.create(name);
  },

  update: async (categoryId: bigint, name: string) => {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new ApiError(
        "not_found",
        "カテゴリが見つかりません"
      );
    }

    const sameName = await categoryRepository.findByName(name);
    if (sameName && sameName.id !== categoryId) {
      throw new ApiError(
        "duplicate_error",
        "同じカテゴリ名が既に存在します"
      );
    }

    return categoryRepository.updateName(categoryId, name);
  },

  remove: async (categoryId: bigint) => {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new ApiError(
        "not_found",
        "カテゴリが見つかりません"
      );
    }

    const usedCount = await categoryRepository.countArticlesByCategoryId(categoryId);
    if (usedCount > 0) {
      // ❗ conflict は使えない → forbidden or validation_error に寄せる
      throw new ApiError(
        "forbidden",
        "このカテゴリは使用中のため削除できません"
      );
    }

    return categoryRepository.delete(categoryId);
  },
};
