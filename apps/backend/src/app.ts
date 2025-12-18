import express from 'express'
import routes from './routes/index'

import cookieParser from 'cookie-parser';

const app = express()

// JSON を受け取るための設定
app.use(express.json())

//クッキーを使えるようにする
app.use(cookieParser())

// /api から下は全部 routes に委譲
app.use('/api', routes)

export default app