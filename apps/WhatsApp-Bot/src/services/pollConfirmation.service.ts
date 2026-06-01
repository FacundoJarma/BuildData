import { Chat, Message, Poll } from "whatsapp-web.js";
import { getUserObras } from "./user.service";
import {
  setPending,
  clearPending,
  getPending,
  PendingQuery,
} from "../handlers/pendingQuery.store";
import { MSG } from "../shared/responses";

function executePending(pending: PendingQuery, obraNombre: string): void {
  const tag = `obra "${obraNombre}"`;
  switch (pending.type) {
    case "operation":
      console.log(
        `Operación confirmada para ${tag}: ${JSON.stringify(pending.operation)}`,
      );
      break;
    case "comprobante":
      console.log(
        `Comprobante confirmado para ${tag}: ${JSON.stringify(pending.data)}`,
      );
      break;
    case "factura":
      console.log(
        `Factura confirmada para ${tag}: ${JSON.stringify(pending.data)}`,
      );
      break;
  }
}

export async function sendObraPoll(
  phone: string,
  chat: Chat,
  pendingQuery: PendingQuery,
): Promise<void> {
  const user = await getUserObras(phone);
  if (!user || user.obras.length === 0) {
    await chat.sendMessage(MSG.ERROR_NO_OBRA);
    return;
  }

  /*if (user.obras.length === 1) {
    const obra = user.obras[0];
    pendingQuery.obra_id = obra.obra_id;
    executePending(pendingQuery, obra.obra_nombre);
    clearPending(phone);
    await chat.sendMessage(
      `✅ Confirmado automáticamente para la obra *${obra.obra_nombre}*.`,
    );
    return;
  }*/

  setPending(phone, pendingQuery);

  const options = user.obras.map((o) => o.obra_nombre);
  options.push("❌ Cancelar");

  const poll = new Poll("¿En qué obra?", options, {
    allowMultipleAnswers: false,
    messageSecret: undefined,
  });
  await chat.sendMessage(poll);
}

export async function handlePollVote(
  voterPhone: string,
  selectedOptionName: string,
  pollMessage: Message,
): Promise<void> {
  const pending = getPending(voterPhone);

  if (!pending) {
    await pollMessage.delete(true);
    return;
  }

  if (selectedOptionName === "❌ Cancelar") {
    clearPending(voterPhone);
    await pollMessage.delete(true);
    const chat = await pollMessage.getChat();
    await chat.sendMessage(MSG.SUCCESS_DATA_CANCELLED);
    return;
  }

  const user = await getUserObras(voterPhone);
  if (!user) {
    clearPending(voterPhone);
    await pollMessage.delete(true);
    const chat = await pollMessage.getChat();
    await chat.sendMessage(MSG.ERROR_NO_OBRA);
    return;
  }

  const obra = user.obras.find((o) => o.obra_nombre === selectedOptionName);
  if (!obra) {
    const chat = await pollMessage.getChat();
    await chat.sendMessage("❌ No encontré esa obra. Intenta de nuevo.");
    return;
  }

  pending.obra_id = obra.obra_id;
  clearPending(voterPhone);
  executePending(pending, obra.obra_nombre);

  await pollMessage.delete(true);
  const chat = await pollMessage.getChat();
  await chat.sendMessage(MSG.SUCCESS_DATA_SAVED);
}
