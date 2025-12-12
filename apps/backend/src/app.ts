import express from 'express'
import routes from './routes/index'
import { errorHandler } from './middlewares/errorMiddleware'

import cookieParser from 'cookie-parser';

const app = express()

// JSON を受け取るための設定
app.use(express.json())

app.use(cookieParser())

// /api から下は全部 routes に委譲
app.use('/api', routes)

// 共通エラーハンドラ
app.use(errorHandler)

export default app