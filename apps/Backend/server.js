import express from "express";
import dotenv from "dotenv";

import dashboardRoutes from "./routes/dashboard.js";
import tareasRoutes from "./routes/tareas.js";
import usuariosRoutes from "./routes/usuarios.js";
import reportesRoutes from "./routes/reportes.js";
import alertasRoutes from "./routes/alertas.js";
import botRoutes from "./routes/bot.js";

dotenv.config();

const app = express();
app.use(express.json());

// Rutas principales
app.use("/dashboard", dashboardRoutes);
app.use("/tareas", tareasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/reportes", reportesRoutes);
app.use("/alertas", alertasRoutes);

// Endpoints para el bot de Facu
app.use("/bot", botRoutes);

app.get("/", (req, res) => {
  res.send("BuildData API funcionando");
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});