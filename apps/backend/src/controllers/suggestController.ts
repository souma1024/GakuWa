import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const suggestController = async (req: Request, res: Response) => {
  const { type, keyword } = (req as any).validatedQuery;

  // ★ 決定打：limit のデフォルト保証
  const limit =
    typeof (req as any).validatedQuery.limit === "number"
      ? (req as any).validatedQuery.limit
      : 5;

  try {
    if (type === "category") {
      const categories = await prisma.category.findMany({
        where: {
          name: { contains: keyword },
        },
        orderBy: { name: "asc" },
        take: limit, // ★ 常に number（最大5）
        select: { id: true, name: true },
      });

      return res.json({
        success: true,
        data: categories.map((c) => ({
          id: String(c.id),
          name: c.name,
        })),
      });
    }

    if (type === "tag") {
      const tags = await prisma.tag.findMany({
        where: {
          name: { contains: keyword },
        },
        orderBy: { name: "asc" },
        take: limit, // ★ ここも同様
        select: { id: true, name: true },
      });

      return res.json({
        success: true,
        data: tags.map((t) => ({
          id: String(t.id),
          name: t.name,
        })),
      });
    }

    return res.status(400).json({
      success: false,
      error: { type: "validation_error", message: "type が不正です" },
    });
  } catch (err) {
    console.error("Suggest API Error:", err);
    return res.status(500).json({
      success: false,
      error: { type: "server_error", message: "Internal Server Error" },
    });
  }
};


