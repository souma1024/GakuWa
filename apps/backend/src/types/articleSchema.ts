import { z } from "zod";

// ✅ 作成（POST /api/articles）
export const createArticleSchema = z.object({
  title: z.string().max(255),
  contentMd: z.string().max(65535),
  contentHtml: z.string().max(65535),
  status: z.string().max(65535),
});

// ✅ 更新（PUT /api/articles/:id）
export const updateArticleSchema = z.object({
  title: z.string().max(255).optional(),
  content: z.string().max(65535).optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
