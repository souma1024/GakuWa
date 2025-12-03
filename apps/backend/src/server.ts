import app from './app'
import { env } from './config/env'
import authRouter from './routes/auth'

const port = env.PORT

app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Gakuwa backend listening on port ${port}`)
})