import { getUserByPhone } from "../services/api.service";
import { Command } from "./index";

export const buildingsCommand: Command = {
  name: "!obras",
  description: "Muestra las obras en las que formas parte",
  execute: async (message) => {
    const phone = (await message.getContact()).number;
    const obras = await getUserByPhone(phone)

    message.reply(obras ? `Formas parte de las siguientes obras:\n\n${obras.obras.map(o => `*${o.obra_nombre}* (ID: ${o.obra_id})`).join("\n")}` : "No formas parte de ninguna obra.");
  },
};
