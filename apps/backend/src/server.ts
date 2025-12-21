import app from './app'

import { port } from './config/env'

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
