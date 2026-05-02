import mongoose from "mongoose";
import fs from "fs";

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  data: { type: Buffer, required: true },
});

const Session = mongoose.model("Session", sessionSchema);

export const mongoStore = {
  async sessionExists(options: { session: string }) {
    const doc = await Session.findOne({ sessionId: options.session });
    console.log(`🔍 sessionExists(${options.session}):`, !!doc);
    return !!doc;
  },

  async save(options: { session: string }) {
    const zipPath = `.wwebjs_auth/${options.session}.zip`;

    if (!fs.existsSync(zipPath)) {
      console.error("❌ save: zip no encontrado en", zipPath);
      // buscar en cwd como fallback
      const fallback = `${options.session}.zip`;
      if (!fs.existsSync(fallback)) {
        console.error("❌ save: tampoco en", fallback);
        return;
      }
    }

    const finalPath = fs.existsSync(zipPath)
      ? zipPath
      : `${options.session}.zip`;
    const data = fs.readFileSync(finalPath);

    await Session.findOneAndUpdate(
      { sessionId: options.session },
      { sessionId: options.session, data },
      { upsert: true },
    );
    console.log(`💾 save: sesión guardada (${data.length} bytes)`);
  },

  async extract(options: { session: string; path: string }) {
    const doc = await Session.findOne({ sessionId: options.session });
    if (!doc) {
      console.error("❌ extract: sesión no encontrada en DB");
      return;
    }
    // Asegurar que el directorio existe
    fs.mkdirSync(".wwebjs_auth", { recursive: true });
    fs.writeFileSync(options.path, doc.data);
    console.log(`📦 extract: sesión restaurada en ${options.path}`);
  },
  async delete(options: { session: string }) {
    await Session.deleteOne({ sessionId: options.session });
    console.log(`🗑️ delete: sesión eliminada`);
  },
};
