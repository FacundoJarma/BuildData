import { Client, RemoteAuth } from "whatsapp-web.js";
import mongoose from "mongoose";
import qrcode from "qrcode-terminal";
import { mongoStore } from "./mongoStore";
import { handleMessage } from "./handlers/message.handler";

const mongoUri = process.env.MONGO_URI!;
const isProduction = process.env.NODE_ENV === "production";

export async function initClient() {
  await mongoose.connect(mongoUri);
  console.log("✅ Conectado a MongoDB");

  const client = new Client({
    authStrategy: new RemoteAuth({
      clientId: "whatsapp-bot-final",
      store: mongoStore,
      backupSyncIntervalMs: 300_000,
    }),
    puppeteer: {
      headless: true,
      executablePath: isProduction
        ? "./puppeteer_data/chrome/linux-146.0.7680.31/chrome-linux64/chrome"
        : undefined,
      args: isProduction ? ["--no-sandbox", "--disable-setuid-sandbox"] : [],
    },
  });

  client.on("qr", (qr) => {
    console.log("Escaneá este QR con WhatsApp:");
    qrcode.generate(qr, { small: true });
  });

  client.on("remote_session_saved", () => {
    console.log("💾 Sesión guardada en MongoDB");
  });

  client.on("ready", () => {
    console.log("✅ Bot conectado y listo");
  });

  client.on("auth_failure", () => {
    console.error("❌ Error de autenticación");
  });
  client.on("message", (message) => {
    handleMessage(message);
  });

  client.initialize();
}
