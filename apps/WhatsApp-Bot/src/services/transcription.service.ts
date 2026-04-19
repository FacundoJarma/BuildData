import Groq from 'groq-sdk'
import fs from 'fs'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function transcribeAudio(
  base64Audio: string,
  mimetype: string
): Promise<string> {
    
  const buffer = Buffer.from(base64Audio, 'base64')
  const tmpPath = `./tmp/audio-${Date.now()}.ogg`

  fs.mkdirSync('./tmp', { recursive: true })
  fs.writeFileSync(tmpPath, buffer)

  try {
    const response = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tmpPath),
      model: 'whisper-large-v3-turbo', // el mejor modelo gratuito de Groq
      language: 'es'
    })

    return response.text

  } finally {
    fs.unlinkSync(tmpPath)
  }
}