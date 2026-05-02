import { startServer } from "./server";
import { initClient } from "./client";

initClient().catch(console.error);
startServer();

console.log("🚀 Iniciando bot de WhatsApp...");
