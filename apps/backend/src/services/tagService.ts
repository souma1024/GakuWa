import { tagRepository } from "../repositories/tagRepository";
import { ApiError } from "../errors/apiError";

export const tagService = {
  /**
   * タグ作成（ユーザー）
   * 既存タグがあれば再利用、なければ新規作成
   */
  async findOrCreateTag(name: string) {
    if (!name || typeof name !== "string") {
      throw new ApiError("validation_error", "タグ名は必須です");
    }

    const existing = await tagRepository.findByName(name);
    if (existing) {
      return existing;
    }

    return await tagRepository.create(name);
  },
};
