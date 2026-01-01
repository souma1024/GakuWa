import { tagRepository } from "../repositories/tagRepository";


export const tagService = {
  async findOrCreateTag(name: string) {
    // 同名タグがあるか確認
    const existing = await tagRepository.findByName(name);
    if (existing) {
      return existing;
    }

    // なければ作成
    return await tagRepository.create(name);
  },
};
