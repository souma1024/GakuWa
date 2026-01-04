import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * タグ作成（既存があればそれを返す）
 * POST /api/tags
 */
export const createTagController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body;

    // ===== ① バリデーション =====

    // 型チェック
    if (typeof name !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          message: "タグ名は文字列で入力してください",
        },
      });
    }

    // 前後の空白を除去
    const trimmedName = name.trim();

    // 空文字チェック
    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        error: {
          message: "タグを選択してください",
        },
      });
    }

    // 文字数チェック
    if (trimmedName.length > 30) {
      return res.status(400).json({
        success: false,
        error: {
          message: "タグ名は30文字以内で入力してください",
        },
      });
    }

    // ===== ② 既存タグ確認 =====
    const existingTag = await prisma.tag.findUnique({
      where: {
        name: trimmedName,
      },
    });

    if (existingTag) {
      // 既存タグがあればそのまま返す
      return res.status(200).json({
        success: true,
        data: existingTag,
      });
    }

    // ===== ③ 新規作成 =====
    const newTag = await prisma.tag.create({
      data: {
        name: trimmedName,
      },
    });

    return res.status(201).json({
      success: true,
      data: newTag,
    });

  } catch (error) {
    console.error("createTagController error:", error);

    return res.status(500).json({
      success: false,
      error: {
        message: "サーバーエラーが発生しました",
      },
    });
  }
};