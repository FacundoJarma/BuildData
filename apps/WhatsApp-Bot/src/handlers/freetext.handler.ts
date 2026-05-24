// src/handlers/freetext.handler.ts
import { Message } from "whatsapp-web.js";
import { textToOperation } from "../services/llm.service";
import { setPending, clearPending, hasPending, RawOperation } from "./pendingQuery.store";
import { MSG, MSG_LLM_ERROR, MSG_OPERATION_GENERATED } from "../shared/responses";

export async function handleFreeText(phone: string, message: Message): Promise<void> {
  try {
    if (hasPending(phone)) {
      clearPending(phone);
      await message.reply(MSG.ERROR_PENDING_CANCELLED);
    }

    const raw = await textToOperation(message.body.trim());

    let parsed: RawOperation;
    try {
      parsed = JSON.parse(raw) as RawOperation;
    } catch {
      await message.reply(MSG.ERROR_PARSE_FAILED);
      return;
    }

    if (parsed.error) {
      await message.reply(MSG_LLM_ERROR(parsed.error));
      return;
    }

    if (!parsed.action || !parsed.table || !parsed.data) {
      await message.reply(MSG.ERROR_OPERATION_INCOMPLETE);
      return;
    }

    setPending(phone, { type: "operation", operation: parsed });

    await message.reply("Ok!" + parsed.comment + "\n\n" + MSG.PROMPT_CONFIRM);

  } catch (error) {
    console.error("Error al procesar texto:", error);
    await message.reply(MSG.ERROR_PROCESSING);
  }
}