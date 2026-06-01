import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import tareasRoutes from "./routes/tareas.js";
import usuariosRoutes from "./routes/usuarios.js";
import reportesRoutes from "./routes/reportes.js";
import alertasRoutes from "./routes/alertas.js";
import obrerosRoutes from "./routes/obreros.js"
import botRoutes from "./routes/bot.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(express.json());

// Auth — pública (no necesita token)
app.use("/auth", authRoutes);

// Bot — pública pero usa service_role internamente
app.use("/bot", botRoutes);

// Todo lo demás — requiere estar logueado
app.use("/dashboard", authMiddleware, dashboardRoutes);
app.use("/tareas", authMiddleware, tareasRoutes);
app.use("/usuarios", authMiddleware, usuariosRoutes);
app.use("/reportes", authMiddleware, reportesRoutes);
app.use("/alertas", authMiddleware, alertasRoutes);
app.use("/obreros", obrerosRoutes)
import obrasRoutes from "./routes/obras.js";
app.use("/obras", authMiddleware, obrasRoutes);

app.get("/", (req, res) => {
  res.send("BuildData API funcionando");
});

app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001");
});