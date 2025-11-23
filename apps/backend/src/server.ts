import app from './app'
import { env } from './config/env'

const port = env.PORT

app.listen(port, () => {
  console.log(`Gakuwa backend listening on port ${port}`)
})