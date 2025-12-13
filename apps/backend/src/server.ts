import express from 'express'
import authRouter from './routes/auth'

const app = express()

app.use(express.json())

app.use('/api/auth', authRouter)

const PORT = 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('OK')
})
