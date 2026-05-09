import { Message } from "whatsapp-web.js";
import {
  analyzeDocument,
  ComprobanteData,
  FacturaData,
} from "../services/vision.service";

import { setPending, clearPending, hasPending } from "./pendingQuery.store";

export async function handleImage(
  phone: string,
  message: Message,
): Promise<void> {
  if (hasPending(phone)) {
    clearPending(phone);
    await message.reply("⚠️ Consulta anterior cancelada.");
  }

  const media = await message.downloadMedia();

  if (!media) {
    await message.reply("❌ No pude descargar la imagen.");
    return;
  }

  const result = await analyzeDocument(media.data, media.mimetype);

  switch (result.type) {
    case "comprobante":
      await message.reply(formatComprobante(result.data as ComprobanteData));
      await message.reply(
        "¿Entendí correctamente? Respondé *!confirm* para guardar o *!cancel* para cancelar.",
      );

      setPending(phone, {
        type: "comprobante",
        data: result.data as ComprobanteData,
      });
      break;

    case "factura":
      await message.reply(formatFactura(result.data as FacturaData));
      await message.reply(
        "¿Entendí correctamente? Respondé *!confirm* para guardar o *!cancel* para cancelar.",
      );

      setPending(phone, { type: "factura", data: result.data as FacturaData });
      break;

    case "desconocido":
      await message.reply(
        "❌ No pude identificar el tipo de documento. Asegurate de enviar un comprobante o factura.",
      );
      break;
  }
}

function formatComprobante(data: ComprobanteData): string {
  return `
✅ *Comprobante detectado*

🏦 *Entidad:* ${data.entidad || "-"}
📋 *Tipo:* ${data.tipo || "-"}
📅 *Fecha:* ${data.fecha || "-"}
💰 *Monto:* ${data.monto} ${data.moneda}
👤 *Origen:* ${data.origen || "-"}
👤 *Destino:* ${data.destino || "-"}
🔢 *N° Operación:* ${data.numeroOperacion || "-"}
`.trim();
}

function formatFactura(data: FacturaData): string {
  const items = data.items
    .map((i) => `  • ${i.descripcion} x${i.cantidad} — ${i.subtotal}`)
    .join("\n");

  return `
🧾 *Factura tipo ${data.tipoFactura} detectada*

📋 *N° Factura:* ${data.numero || "-"}
📅 *Fecha:* ${data.fecha || "-"}
📅 *Vencimiento:* ${data.fechaVencimiento || "-"}

🏢 *Emisor:* ${data.emisor || "-"}
🪪 *CUIT Emisor:* ${data.cuitEmisor || "-"}
👤 *Receptor:* ${data.receptor || "-"}
🪪 *CUIT Receptor:* ${data.cuitReceptor || "-"}

📦 *Items:*
${items || "  -"}

💵 *Subtotal:* ${data.subtotal || "-"}
📊 *IVA:* ${data.iva || "-"}
💰 *Total:* ${data.total || "-"}
`.trim();
}
