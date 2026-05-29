import { Command } from "./index";
import { registerUser } from "../services/api.service";
import { invalidateUserCache } from "../services/user.service";

export const loginCommand: Command = {
  name: "!iniciar",
  description: "Es el comando para iniciar sesión. El bot te guiará en el proceso.",
  execute: async (message) => {
    const name = message.body.replace("!iniciar ", "").trim();
    if (!name) {
      await message.reply("Por favor, proporciona tu nombre después del comando. Ejemplo: !iniciar Juan");
      return;
    }

    const phone = (await message.getContact()).number;
    await registerUser(phone, name);
    invalidateUserCache(phone);
    await message.reply(`¡Bienvenido, ${name}! Ya formas parte de la obra.`);

  },
};
