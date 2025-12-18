// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { registerUser } from './services/userEntry'; // ★ここを 'auth' から 'entry' に変更しました

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(cors());
app.use(express.json()); // JSONボディをパースするために必須

// ルート定義
app.get('/', (req, res) => {
  res.send('GakuWa Backend API is running!');
});

// 本登録APIのエンドポイント
app.post('/api/register', async (req: Request, res: Response): Promise<void> => {
  try {
    // リクエストボディを受け取る
    const { email, otpId, desiredName } = req.body;

    // バリデーション（簡易）
    if (!email || !otpId) {
      res.status(400).json({ 
        success: false, 
        error: { message: 'emailとotpIdは必須です' } 
      });
      return; // 必ずreturnして処理を終了させる
    }

    // 先ほどのロジックを呼び出し
    const result = await registerUser({ email, otpId, desiredName });

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});