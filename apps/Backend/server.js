import express from "express";
import dotenv from "dotenv";
import cors from "cors"


import rubrosRoutes from "./routes/rubros.js";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import tareasRoutes from "./routes/tareas.js";
import usuariosRoutes from "./routes/usuarios.js";
import reportesRoutes from "./routes/reportes.js";
import alertasRoutes from "./routes/alertas.js";
import botRoutes from "./routes/bot.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import obrasRoutes from "./routes/obras.js";
import obrerosRoutes from "./routes/obreros.js";
import proveedoresRoutes from "./routes/proveedores.js";
import gastosRoutes from "./routes/gastos.js";
import presupuestosRoutes from "./routes/presupuestos.js";
import materialesRoutes from "./routes/materiales.js";

dotenv.config();

const app = express();
app.use(cors())
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
app.use("/obreros", authMiddleware, obrerosRoutes);
app.use("/proveedores", authMiddleware, proveedoresRoutes);
app.use("/gastos", authMiddleware, gastosRoutes);
app.use("/presupuestos", authMiddleware, presupuestosRoutes);
app.use("/materiales", authMiddleware, materialesRoutes);
app.use("/obras", authMiddleware, obrasRoutes);
app.use("/usuarios", authMiddleware, usuariosRoutes);
app.use("/bot", authMiddleware, botRoutes);
app.use("/auth", authMiddleware, authRoutes);  // aunque las rutas de auth son públicas, el middleware no hace nada y deja pasar igual
app.use("/rubros", authMiddleware, rubrosRoutes);


app.get("/", (req, res) => {
  res.send("BuildData API funcionando");
});

app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001");
});