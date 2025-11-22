import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

// JSON を受け取るための設定
app.use(express.json())

// CORS（フロントから叩けるようにしておく）
app.use(
  cors({
    origin: 'http://localhost:5173', // フロントのURL
    credentials: true,
  }),
)

// /api から下は全部 routes に委譲
app.use('/api', routes)

// 共通エラーハンドラ
app.use(errorHandler)

export default app