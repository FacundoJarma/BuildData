import { initClient } from "./client";

console.log("🚀 Iniciando bot de WhatsApp...");

initClient()
  .then(() => {
    console.log("✅ initClient completado");
  })
  .catch((err) => {
    console.error("❌ initClient falló:", err);
    process.exit(1);
  });