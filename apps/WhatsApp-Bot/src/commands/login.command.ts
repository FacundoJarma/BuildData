import { Command } from "./index";
import { registerUser } from "../services/api.service";
import { invalidateUserCache } from "../services/user.service";

export const loginCommand: Command = {
  name: "!iniciar",
  description: "Es el comando para iniciar sesión. El bot te guiará en el proceso. Uso: !iniciar [nombre] [obra_id]",
  execute: async (message, args) => {
    const obra_id = args.pop();
    const name = args.join(" ");

    if (!name || !obra_id) {
      await message.reply("Por favor, proporciona tu nombre y el ID de obra. Ejemplo: !iniciar Juan 123");
      return;
    }

    const phone = (await message.getContact()).number;
    await registerUser(phone, name, obra_id);
    invalidateUserCache(phone);
    await message.reply(`¡Bienvenido, ${name}! Ya formas parte de la obra.`);
  },
};