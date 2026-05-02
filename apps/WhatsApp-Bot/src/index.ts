import { startServer } from "./server";
import { initClient } from "./client";

console.log("🚀 Iniciando bot de WhatsApp...");

initClient()
  .then(() => {
    console.log("✅ initClient completado");
    startServer();
  })
  .catch((err) => {
    console.error("❌ initClient falló:", err);
    process.exit(1);
  });