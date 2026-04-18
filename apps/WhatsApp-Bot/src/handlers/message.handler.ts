import { Message } from "whatsapp-web.js";
import { getCommand, registerCommand } from "../commands/index";
import { ayudaCommand } from "../commands/ayuda.command";
import { handleFreeText } from "./freetext.handler";

registerCommand(ayudaCommand);

const PREFIX = "!";

export async function handleMessage(message: Message): Promise<void> {
  console.log(`Mensaje de ${message.from}: ${message.body}`);

  if (message.body.startsWith(PREFIX)) {
    // — Flujo de comandos —
    const command = getCommand(message.body.split(" ")[0]);

    if (!command) {
      await message.reply(
        "Comando no reconocido. Escribí *!ayuda* para ver los disponibles.",
      );
      return;
    }

    await command.execute(message);
  } else {
    await handleFreeText(message);
  }
}
