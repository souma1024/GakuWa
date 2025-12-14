import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index';
import { errorHandler } from './middlewares/errorMiddleware';

const app = express();

// CORS設定
app.use(cors({
  origin: 'http://localhost:5173', // フロントエンドのURL
  credentials: true // Cookieを送受信するために必要
}));

// JSON を受け取るための設定
app.use(express.json());

// Cookie を解析するための設定
app.use(cookieParser());

// /api から下は全部 routes に委譲
app.use('/api', routes);

// 共通エラーハンドラ
app.use(errorHandler);

export default app;
