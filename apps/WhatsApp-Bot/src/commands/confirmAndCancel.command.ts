// src/commands/confirmAndCancel.command.ts
import { Command } from "./index";
import { getPending, clearPending, hasPending } from "../handlers/pendingQuery.store";

export const confirmCommand: Command = {
  name: "!confirm",
  description: "Confirma la carga de datos pendiente",
  execute: async (message) => {
    const phone = (await message.getContact()).number;
    const sql = getPending(phone);

    if (!sql) {
      await message.reply("⚠️ No hay ninguna carga de datos pendiente.");
      return;
    }

    clearPending(phone);
    console.log(`Ejecutando SQL: ${sql}`);
    // await sendToDb(sql);
    await message.reply("✅ Datos guardados correctamente.");
  },
};

export const cancelCommand: Command = {
  name: "!cancel",
  description: "Cancela la carga de datos pendiente",
  execute: async (message) => {
    const phone = (await message.getContact()).number;

    if (!hasPending(phone)) {
      await message.reply("⚠️ No hay ninguna carga de datos pendiente.");
      return;
    }

    clearPending(phone);
    await message.reply("❌ Carga de datos cancelada.");
  },
};