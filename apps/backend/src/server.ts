import app from './app'
import { env } from './config/env'

const port = env.PORT
const loginapiRouter = require('./routes/loginapi');

app.use('/api', loginapiRouter);

app.listen(port, () => {
  console.log(`Gakuwa backend listening on port ${port}`)
})