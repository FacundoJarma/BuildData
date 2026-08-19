import { Chat, Message, Poll } from "whatsapp-web.js";
import { getUserObras } from "./user.service";
import {
  setPending,
  clearPending,
  getPending,
  PendingQuery,
} from "../handlers/pendingQuery.store";
import { callEndpoint } from "./api.service";
import { MSG } from "../shared/responses";

// Los montos de vision.service.ts llegan en formato argentino ("$1.234,56") — hay que
// convertirlos a number antes de mandarlos a /bot/gastos, que espera monto: number.
function parseMontoArg(raw: string): number {
  const normalized = raw.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
  return parseFloat(normalized) || 0;
}

async function executePending(pending: PendingQuery, obraNombre: string, phone: string): Promise<void> {
  const tag = `obra "${obraNombre}"`;
  switch (pending.type) {
    case "operation": {
      const { endpoint, method, data } = pending.operation;
      const payload = {
        ...data,
        obra_id: pending.obra_id,
      };
      console.log(`[executePending] → ${method} ${endpoint} para ${tag}`);
      console.log(`[executePending] payload: ${JSON.stringify(payload)}`);
      try {
        //const result = await callEndpoint(method, endpoint, payload);
        //console.log(`[executePending] respuesta: ${JSON.stringify(result)}`);
      } catch (error) {
        console.error(`[executePending] error llamando ${endpoint}:`, error);
        throw error;
      }
      break;
    }
    case "comprobante": {
      const d = pending.data;
      const payload = {
        obra_id: pending.obra_id,
        telefono: phone,
        monto: parseMontoArg(d.monto),
        moneda: d.moneda || "ARS",
        descripcion: `${d.entidad} - ${d.tipo}`,
        origen: "bot_imagen",
        comprobante_detalle: d,
      };
      console.log(`[executePending] → POST /bot/gastos (comprobante) para ${tag}`);
      const result = await callEndpoint("POST", "/bot/gastos", payload);
      console.log(`[executePending] respuesta: ${JSON.stringify(result)}`);
      break;
    }
    case "factura": {
      const d = pending.data;
      const payload = {
        obra_id: pending.obra_id,
        telefono: phone,
        monto: parseMontoArg(d.total),
        moneda: "ARS",
        descripcion: `Factura ${d.tipoFactura} ${d.numero} de ${d.emisor}`,
        origen: "bot_imagen",
        comprobante_detalle: d,
      };
      console.log(`[executePending] → POST /bot/gastos (factura) para ${tag}`);
      const result = await callEndpoint("POST", "/bot/gastos", payload);
      console.log(`[executePending] respuesta: ${JSON.stringify(result)}`);
      break;
    }
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
  try {
    await executePending(pending, obra.obra_nombre, voterPhone);
    await pollMessage.delete(true);
    const chat = await pollMessage.getChat();
    await chat.sendMessage(MSG.SUCCESS_DATA_SAVED);
  } catch (error) {
    await pollMessage.delete(true);
    const chat = await pollMessage.getChat();
    await chat.sendMessage("❌ Ocurrió un error al ejecutar la operación. Intentá de nuevo.");
  }
}
