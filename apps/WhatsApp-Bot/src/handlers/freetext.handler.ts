import { Message } from "whatsapp-web.js";
import { textToSQL } from "../services/llm.service";

export async function handleFreeText(message: Message): Promise<void> {
  const text = message.body.trim();

  try {
    const sql = await textToSQL(text);

    if (sql.startsWith("ERROR:")) {
      await message.reply(`❌ ${sql}`);
      return;
    }

    console.log(`SQL generado: ${sql}`);

    // Por ahora respondemos con el SQL generado
    // Cuando tengas el backend conectado, acá ejecutás la query
    await message.reply(`✅ Consulta generada:\n\`\`\`\n${sql}\n\`\`\``);

    // await ejecutarQuery(sql, message)  ← próximo paso
  } catch (error) {
    console.error("Error al procesar texto:", error);
    await message.reply("❌ Hubo un error procesando tu consulta.");
  }
}
