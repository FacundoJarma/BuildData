import { Message } from "whatsapp-web.js";
import { transcribeAudio } from "../services/transcription.service";
import { handleFreeText } from "./freetext.handler";

export async function handleAudio(phone: string, message: Message): Promise<void> {
  const media = await message.downloadMedia();

  if (!media) {
    await message.reply("❌ No pude descargar el audio, intentá de nuevo.");
    return;
  }

  await message.reply("🎙️ Transcribiendo tu audio...");

  const transcripcion = await transcribeAudio(media.data, media.mimetype);

  if (!transcripcion) {
    await message.reply("❌ No pude entender el audio.");
    return;
  }

  console.log(`Transcripción de ${phone}: ${transcripcion}`);
  
  await message.reply(`Lo que entendi fue: "${transcripcion}"`);
  message.body = transcripcion;
  await handleFreeText(message);
}
