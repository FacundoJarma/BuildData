import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { authMiddleware } from "./middleware/authMiddleware.js";

// Rutas públicas
import authRoutes from "./routes/auth.js";

// Rutas del bot
import botRoutes from "./routes/bot.js";

// Rutas protegidas
import obrasRoutes from "./routes/obras.js";
import dashboardRoutes from "./routes/dashboard.js";
import tareasRoutes from "./routes/tareas.js";
import alertasRoutes from "./routes/alertas.js";
import rubrosRoutes from "./routes/rubros.js";
import presupuestosRoutes from "./routes/presupuestos.js";
import proveedoresRoutes from "./routes/proveedores.js";
import usuariosRoutes from "./routes/usuarios.js";
import materialesRoutes from "./routes/materiales.js";
import gastosRoutes from "./routes/gastos.js";
import reportesRoutes from "./routes/reportes.js";
import obrerosRoutes from "./routes/obreros.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ──────────────────────────────────────────
// Públicas
// ──────────────────────────────────────────

app.use("/auth", authRoutes);

// ──────────────────────────────────────────
// Bot (service_role key)
// ──────────────────────────────────────────

app.use("/bot", botRoutes);

// ──────────────────────────────────────────
// Todo lo demás requiere usuario autenticado
// ──────────────────────────────────────────

app.use(authMiddleware);

// Obras
app.use("/", obrasRoutes);

// Dashboard
app.use("/dashboard", dashboardRoutes);

// Tareas
app.use("/tareas", tareasRoutes);

// Alertas
app.use("/alertas", alertasRoutes);

// Rubros
app.use("/obras", rubrosRoutes);

// Presupuestos
app.use("/presupuestos", presupuestosRoutes);

// Proveedores
app.use("/proveedores", proveedoresRoutes);

// Usuarios
app.use("/usuarios", usuariosRoutes);

// Materiales
app.use("/materiales", materialesRoutes);

// Gastos
app.use("/gastos", gastosRoutes);

// Reportes
app.use("/reportes", reportesRoutes);

// Obreros
app.use("/obreros", obrerosRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("BuildData API funcionando");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});