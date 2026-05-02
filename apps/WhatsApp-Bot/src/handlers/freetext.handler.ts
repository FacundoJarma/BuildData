// src/handlers/freetext.handler.ts
import { Message } from "whatsapp-web.js";
import { textToSQL } from "../services/llm.service";
import { setPending, clearPending, hasPending } from "./pendingQuery.store";

export async function handleFreeText(phone: string, message: Message): Promise<void> {
  try {
    // Si había una consulta pendiente, cancelarla antes de procesar la nueva
    if (hasPending(phone)) {
      clearPending(phone);
      await message.reply("⚠️ Consulta anterior cancelada.");
    }

    const sql = await textToSQL(message.body.trim());

    if (sql.startsWith("ERROR:")) {
      await message.reply(`❌ ${sql}`);
      return;
    }

    setPending(phone, sql);

    await message.reply(`✅ Consulta generada:\n\`\`\`\n${sql}\n\`\`\``);
    await message.reply("¿Entendí correctamente? Respondé *!confirm* para guardar o *!cancel* para cancelar.");

  } catch (error) {
    console.error("Error al procesar texto:", error);
    await message.reply("❌ Hubo un error procesando tu consulta.");
  }
}