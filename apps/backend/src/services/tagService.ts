import { tagRepository } from "../repositories/tagRepository";
import { ApiError } from "../errors/apiError";

export const tagService = {
  async findOrCreateTag(name: string) {
    if (!name || typeof name !== "string") {
      throw new ApiError("validation_error", "タグ名は必須です");
    }

    // 同名タグがあるか確認
    const existing = await tagRepository.findByName(name);
    if (existing) {
      return existing;
    }

    // なければ作成
    return await tagRepository.create(name);
  },
};
