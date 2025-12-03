import { Router, Request, Response } from "express";
import db from '../config/db'

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    // ✅ バリデーション
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          type: "validation_error",
          message: "メールアドレスとパスワードは必須です",
          fields: ["email", "password"],
        },
      });
    }

    // ✅ ユーザ検索
    const [rows] = await db.execute(
      "SELECT handle, password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          type: "auth_error",
          message: "メールアドレスまたはパスワードが異なります",
          fields: ["email", "password"],
        },
      });
    }

    const user = users[0];

    // ✅ パスワード照合（今は平文）
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: {
          type: "auth_error",
          message: "メールアドレスまたはパスワードが異なります",
          fields: ["email", "password"],
        },
      });
    }

    // ✅ 成功レスポンス
    return res.json({
      success: true,
      data: {
        handle: user.handle,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: {
        type: "server_error",
        message: "サーバーエラーが発生しました",
      },
    });
  }
});

export default router;
