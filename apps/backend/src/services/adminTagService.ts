import { adminTagRepository } from "../repositories/adminTagRepository";
import { ApiError } from "../errors/apiError";

export const adminTagService = {
  async deleteTag(tagId: number) {
    // ① タグ存在チェック
    const tag = await adminTagRepository.findById(tagId);
    if (!tag) {
      throw new ApiError("not_found", "タグが存在しません");
    }

    // ② 使用中チェック
    const isUsed = await adminTagRepository.isTagUsed(tagId);
    if (isUsed) {
      throw new ApiError(
        "validation_error",
        "このタグは使用中のため削除できません"
      );
    }

    // ③ 削除
    await adminTagRepository.delete(tagId);
  },
};
