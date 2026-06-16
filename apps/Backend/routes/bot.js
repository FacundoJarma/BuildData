import { Router } from "express";
import { botAuthMiddleware } from "../middleware/botAuthMiddleware.js";
import {
  recibirMensaje,
  crearSubtareaDesdeBot,
  crearPedidoDeCompra,
  registrarRetraso,
  actualizarStock,
} from "../controllers/botController.js";
import { registrarObrero, getUserByPhone } from "../controllers/obrerosController.js";

const router = Router();

// Todas las rutas /bot/* requieren la service_role key, no un JWT de usuario
router.use(botAuthMiddleware);

// Recepción del mensaje crudo
router.post("/mensaje", recibirMensaje);

// Endpoints específicos que Facu llama según lo que detectó en el mensaje
router.post("/subtarea", crearSubtareaDesdeBot);
router.post("/pedidoDeCompra", crearPedidoDeCompra);
router.post("/retraso", registrarRetraso);
router.post("/stock", actualizarStock);

// Obreros
router.post("/obreros/registrar", registrarObrero);
router.get("/obreros/telefono/:phone", getUserByPhone);


export default router;