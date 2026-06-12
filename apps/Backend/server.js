import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { authMiddleware } from "./middleware/authMiddleware.js";

// Auth
import authRoutes from "./routes/auth.js";

// Obras y sub-recursos anidados
import { getObras, crearObra, getObra, updateObra, deleteObra, toggleStarred } from "./controllers/obrasController.js";
import { getDashboard } from "./controllers/dashboardController.js";
import { getTareas, crearTarea, updateTarea, deleteTarea } from "./controllers/tareasController.js";
import { getAlertas, crearAlerta, resolverAlerta } from "./controllers/alertasController.js";
import { getActividad } from "./controllers/actividadController.js";
import { getMiembros, addMiembro, removeMiembro } from "./controllers/miembrosController.js";
import { getRubros, crearRubro, updateRubro, deleteRubro } from "./controllers/rubrosController.js";
import { getFiles, uploadFile, deleteFile } from "./controllers/archivosController.js";

// Bot (para Facu)
import botRoutes from "./routes/bot.js";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

// ── Auth (pública) ────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);

// ── Bot (usa service_role internamente, sin auth de usuario) ──────────────────
app.use("/bot", botRoutes);

// ── Obras y todo lo anidado (requieren token) ─────────────────────────────────
app.use(authMiddleware);

// Obras
app.get("/obras", getObras);
app.post("/obras", crearObra);
app.get("/obras/:obraId", getObra);
app.patch("/obras/:obraId", updateObra);
app.delete("/obras/:obraId", deleteObra);
app.patch("/obras/:obraId/starred", toggleStarred);

// Dashboard
app.get("/obras/:obraId/dashboard", getDashboard);

// Miembros
app.get("/obras/:obraId/miembros", getMiembros);
app.post("/obras/:obraId/miembros", addMiembro);
app.delete("/obras/:obraId/miembros/:userId", removeMiembro);

// Rubros
app.get("/obras/:obraId/rubros", getRubros);
app.post("/obras/:obraId/rubros", crearRubro);
app.patch("/obras/:obraId/rubros/:rubroId", updateRubro);
app.delete("/obras/:obraId/rubros/:rubroId", deleteRubro);

// Archivos
app.get("/obras/:obraId/files", getFiles);
app.post("/obras/:obraId/files", upload.single("file"), uploadFile);
app.delete("/obras/:obraId/files/:fileId", deleteFile);

// Tareas
app.get("/obras/:obraId/tareas", getTareas);
app.post("/obras/:obraId/tareas", crearTarea);
app.patch("/obras/:obraId/tareas/:tareaId", updateTarea);
app.delete("/obras/:obraId/tareas/:tareaId", deleteTarea);

// Alertas
app.get("/obras/:obraId/alertas", getAlertas);
app.post("/obras/:obraId/alertas", crearAlerta);
app.patch("/obras/:obraId/alertas/:alertaId/resolver", resolverAlerta);

// Actividad
app.get("/obras/:obraId/actividad", getActividad);

app.get("/", (req, res) => res.send("BuildData API funcionando"));

app.listen(3000, () => console.log("Servidor en http://localhost:3001"));