<<<<<<< HEAD
import { prisma } from "../lib/prisma";
import { ApiError } from "../errors/apiError";

export const adminTagService = {
  /**
   * タグ更新（管理者）
   */
  async updateTag(tagId: number, name: string) {
    if (!Number.isInteger(tagId)) {
      throw new ApiError("validation_error", "タグIDが不正です");
    }

    // ① 対象タグの存在確認
    const existingTag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!existingTag) {
      throw new ApiError("not_found", "タグが存在しません");
    }

    // ② 同名タグ重複チェック（自分自身は除外）
    const duplicated = await prisma.tag.findFirst({
      where: {
        name,
        NOT: { id: tagId },
      },
    });

    if (duplicated) {
      throw new ApiError("validation_error", "同名のタグが既に存在します");
    }

    // ③ 更新
    return await prisma.tag.update({
      where: { id: tagId },
      data: { name },
    });
  },

  /**
   * タグ削除（管理者）
   */
  async deleteTag(tagId: number): Promise<void> {
    if (!Number.isInteger(tagId)) {
      throw new ApiError("validation_error", "タグIDが不正です");
    }

    // ① 存在確認
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

=======
import { adminTagRepository } from "../repositories/adminTagRepository";
import { ApiError } from "../errors/apiError";

export const adminTagService = {
  async deleteTag(tagId: number) {
    // ① タグ存在チェック
    const tag = await adminTagRepository.findById(tagId);
>>>>>>> 0adcb1a (タグ削除完成)
    if (!tag) {
      throw new ApiError("not_found", "タグが存在しません");
    }

<<<<<<< HEAD
    /**
     * ⚠️ 現時点では Article-Tag 中間テーブルが無いため
     * 「使用中かどうか」のチェックは行わない
     * （Issue記載どおり：ある場合のみチェック）
     */

    // ② 物理削除
    await prisma.tag.delete({
      where: { id: tagId },
    });
=======
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
>>>>>>> 0adcb1a (タグ削除完成)
  },
};
