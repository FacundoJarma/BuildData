import { Command } from "./index";
import { getPending, clearPending, hasPending } from "../handlers/pendingQuery.store";
import { MSG } from "../shared/responses";

export const confirmCommand: Command = {
  name: "!confirm",
  description: "Confirma la carga de datos pendiente",
  execute: async (message) => {
    const phone = (await message.getContact()).number;
    const pending = getPending(phone);

    if (!pending) {
      await message.reply(MSG.ERROR_NO_PENDING);
      return;
    }

    clearPending(phone);

    switch (pending.type) {
      case "operation":
        console.log(`Operación: ${JSON.stringify(pending.operation)}`);
        // TODO: resolveAndExecute(pending.operation);
        break;
      case "comprobante":
        console.log(`Comprobante: ${JSON.stringify(pending.data)}`);
        break;
      case "factura":
        console.log(`Factura: ${JSON.stringify(pending.data)}`);
        break;
    }

    await message.reply(MSG.SUCCESS_DATA_SAVED);
  },
};

export const cancelCommand: Command = {
  name: "!cancel",
  description: "Cancela la carga de datos pendiente",
  execute: async (message) => {
    const phone = (await message.getContact()).number;

    if (!hasPending(phone)) {
      await message.reply(MSG.ERROR_NO_PENDING);
      return;
    }

    clearPending(phone);
    await message.reply(MSG.SUCCESS_DATA_CANCELLED);
  },
};

