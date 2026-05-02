import express, { Request, Response } from 'express'

// Fake server to keep the bot alive

const app = express()
const PORT: number = 3000

app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong')
})

app.get('/', (_req: Request, res: Response) => {
  res.send('Bot activo 🚀')
})

export const startServer = (): void => {
  app.listen(PORT, () => {
    console.log(`🌐 API escuchando en puerto ${PORT}`)
  })
}