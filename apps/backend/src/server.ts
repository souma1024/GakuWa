import app from './app'
import cookieParser from 'cookie-parser'

import { port } from './config/env'

app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
