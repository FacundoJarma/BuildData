// src/commands/confirmAndCancel.command.ts
import { Command } from "./index";
import { getPending, clearPending, hasPending } from "../handlers/pendingQuery.store";
import { ComprobanteData, FacturaData } from "../services/vision.service";

export const confirmCommand: Command = {
  name: "!confirm",
  description: "Confirma la carga de datos pendiente",
  execute: async (message) => {
    const phone = (await message.getContact()).number;
    const pending = getPending(phone);

    if (!pending) {
      await message.reply("⚠️ No hay ninguna carga de datos pendiente.");
      return;
    }

    clearPending(phone);

    switch (pending.type) {
      case "sql":
        console.log(`Ejecutando SQL: ${pending.sql}`);
        // await sendToDb(pending.sql);
        break;
      case "comprobante":
        console.log(`Comprobante: ${JSON.stringify(pending.data)}`);
        break;
      case "factura":
        console.log(`Factura: ${JSON.stringify(pending.data)}`);
        break;
    }

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