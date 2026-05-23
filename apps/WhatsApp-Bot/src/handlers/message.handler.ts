import { Message, MessageTypes } from "whatsapp-web.js";
import { getCommand, registerCommand } from "../commands/index";
import { ayudaCommand } from "../commands/ayuda.command";
import {
  confirmCommand,
  cancelCommand,
} from "../commands/confirmAndCancel.command";
import { handleFreeText } from "./freetext.handler";
import { handleAudio } from "./voice.handler";
import { clearPending, hasPending } from "../handlers/pendingQuery.store";
import { handleImage } from "./image.handler";
import { MSG } from "../shared/responses";

registerCommand(ayudaCommand);
registerCommand(confirmCommand);
registerCommand(cancelCommand);

const PREFIX = "!";

function randomDelay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function handleMessage(message: Message): Promise<void> {
  const phone = await getPhoneNumber(message);
  await randomDelay(1000, 10000);

  switch (message.type) {
    case MessageTypes.TEXT:
      await handleTextMessage(phone, message);
      break;
    case MessageTypes.VOICE:
    case MessageTypes.AUDIO:
      await handleAudio(phone, message);
      break;
    case MessageTypes.IMAGE:
      await handleImage(phone, message);
      break;
    default:
      console.log(`Tipo de mensaje no manejado: ${message.type}`);
  }
}

async function handleTextMessage(
  phone: string,
  message: Message,
): Promise<void> {
  console.log(`Mensaje de ${phone}: ${message.body}`);

  if (message.body.startsWith(PREFIX)) {
    const command = getCommand(message.body);

    if (!command) {
      if (hasPending(phone)) {
        clearPending(phone);
        await message.reply(MSG.ERROR_CANCELLED_BAD_CMD);
        return;
      }
      await message.reply(MSG.ERROR_UNKNOWN_COMMAND);
      return;
    }
    await command.execute(message);
  } else {
    await handleFreeText(phone, message);
  }
}

async function getPhoneNumber(message: Message): Promise<string> {
  const contact = await message.getContact();
  return contact.number;
}
