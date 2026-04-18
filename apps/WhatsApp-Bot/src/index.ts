import 'dotenv/config'
import { client } from './client'
import { handleMessage } from './handlers/message.handler'

client.on('message', handleMessage)

client.initialize()

console.log('🚀 Iniciando bot de WhatsApp...')