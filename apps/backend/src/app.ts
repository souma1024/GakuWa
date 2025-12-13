import express from 'express'
import cors from 'cors'
import routes from './routes/index'
import { errorHandler } from './middlewares/errorMiddleware'

const app = express()

// JSON を受け取るための設定
app.use(express.json())

//ポート間通信を許可
app.use(cors())

// /api から下は全部 routes に委譲
app.use('/api', routes)

// 共通エラーハンドラ
app.use(errorHandler)

export default app