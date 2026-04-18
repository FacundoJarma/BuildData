import { Message } from "whatsapp-web.js";

export async function handleFreeText(message: Message): Promise<void> {
  const text = message.body.trim();
  const from = message.from;
}
