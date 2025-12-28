// src/types/articleSchema.ts
import { z } from "zod";

// ✅ 作成（POST /api/articles）
export const createArticleSchema = z.object({
  title: z.string().max(255),
  content: z.string().max(65535),
  status: z.literal("draft"), // 仕様どおり draft 固定にするならこれが安全
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;

// ✅ 更新（PUT /api/articles/:id）
export const updateArticleSchema = z.object({
  title: z.string().max(255).optional(),
  content: z.string().max(65535).optional(),
  status: z.enum(["draft", "published"]).optional(), // 仕様に合わせて調整
});

export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
