import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authMiddleware } from "./middleware/authMiddleware.js";

// Auth
import authRoutes from "./routes/auth.js";

// Obras y sub-recursos anidados
import { getObras, crearObra, getObra, updateObra, deleteObra, toggleStarred } from "./controllers/obrasController.js";
import { getDashboard } from "./controllers/dashboardController.js";
import { getTareas, crearTarea } from "./controllers/tareasController.js";
import { getAlertas, crearAlerta, resolverAlerta } from "./controllers/alertasController.js";
import { getRubros, crearRubro, updateRubro, deleteRubro } from "./controllers/rubrosController.js";

// Bot (para Facu)
import botRoutes from "./routes/bot.js";

dotenv.config();

const app = express();

app.use(cors());
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

// Rubros
app.get("/obras/:obraId/rubros", getRubros);
app.post("/obras/:obraId/rubros", crearRubro);
app.patch("/obras/:obraId/rubros/:rubroId", updateRubro);
app.delete("/obras/:obraId/rubros/:rubroId", deleteRubro);

// Tareas
app.get("/obras/:obraId/tareas", getTareas);
app.post("/obras/:obraId/tareas", crearTarea);

// Alertas
app.get("/obras/:obraId/alertas", getAlertas);
app.post("/obras/:obraId/alertas", crearAlerta);
app.patch("/obras/:obraId/alertas/:alertaId/resolver", resolverAlerta);

app.get("/", (req, res) => res.send("BuildData API funcionando"));

app.listen(3001, () => console.log("Servidor en http://localhost:3001"));