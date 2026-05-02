import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const isProduction = process.env.NODE_ENV === "production";

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./session",
  }),
  puppeteer: {
    executablePath: isProduction
      ? "/opt/render/.cache/puppeteer/chrome/linux-146.0.7680.31/chrome-linux64/chrome"
      : undefined,
    headless: true,
    args: isProduction
      ? [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--single-process",
        ]
      : ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  console.log("Escaneá este QR con WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Bot conectado y listo");
});

client.on("auth_failure", () => {
  console.error("❌ Error de autenticación");
});
