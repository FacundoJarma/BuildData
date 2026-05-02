import "dotenv/config";
import { client } from "./client";
import { handleMessage } from "./handlers/message.handler";
import { startServer } from "./server";



client.on("message", handleMessage);

client.initialize();

startServer();
console.log("🚀 Iniciando bot de WhatsApp...");
