// src/types/articleSchema.ts
import { z } from "zod";

// ✅ 作成（POST /api/articles）
export const createArticleSchema = z.object({
  title: z.string().max(255),
  content: z.string().max(65535),
  categoryId: z.number().int().positive(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;

// ✅ 更新（PUT /api/articles/:id）
export const updateArticleSchema = z.object({
  title: z.string().max(255).optional(),
  content: z.string().max(65535).optional(),
});

export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
