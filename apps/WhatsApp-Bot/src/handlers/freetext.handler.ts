import { Message } from "whatsapp-web.js";
import { textToOperation } from "../services/llm.service";
import { clearPending, hasPending, ApiCall } from "./pendingQuery.store";
import { validateApiCall } from "../services/endpointSchema";
import { sendObraConfirmationText } from "../services/pollConfirmation.service";
import { MSG, MSG_LLM_ERROR } from "../shared/responses";

export async function handleFreeText(phone: string, message: Message): Promise<void> {
  try {
    if (hasPending(phone)) {
      clearPending(phone);
      await message.reply(MSG.ERROR_PENDING_CANCELLED);
    }

    const raw = await textToOperation(message.body.trim());

    let parsed: ApiCall;
    try {
      parsed = JSON.parse(raw) as ApiCall;
    } catch {
      await message.reply(MSG.ERROR_PARSE_FAILED);
      return;
    }

    if (parsed.error) {
      await message.reply(MSG_LLM_ERROR(parsed.error));
      return;
    }

    if (!parsed.endpoint || !parsed.data) {
      await message.reply(MSG.ERROR_OPERATION_INCOMPLETE);
      return;
    }

    const validation = validateApiCall(parsed.endpoint, parsed.data);
    if (!validation.valid) {
      const missingList = validation.missingRequired.join(", ");
      await message.reply(`❌ Me falta información: ${missingList}. ¿Podés darme más detalles?`);
      return;
    }

    await message.reply("Ok! " + (parsed.comment || "Estoy procesando tu solicitud..."));
    await sendObraConfirmationText(phone, await message.getChat(), { type: "operation", operation: parsed });

  } catch (error) {
    console.error("Error al procesar texto:", error);
    await message.reply(MSG.ERROR_PROCESSING);
  }
}
