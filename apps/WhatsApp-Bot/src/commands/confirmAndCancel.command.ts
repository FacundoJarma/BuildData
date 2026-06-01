import { Command } from "./index";
import { clearPending, hasPending } from "../handlers/pendingQuery.store";
import { MSG } from "../shared/responses";

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

