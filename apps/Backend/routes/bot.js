import { Router } from "express";
import {
  recibirMensaje,
  crearSubtareaDesdeBot,
  crearPedidoDeCompra,
  registrarRetraso,
  actualizarStock,
} from "../controllers/botController.js";

const router = Router();

// Recepción del mensaje crudo
router.post("/mensaje", recibirMensaje);

// Endpoints específicos que Facu llama según lo que detectó en el mensaje
router.post("/subtarea", crearSubtareaDesdeBot);
router.post("/pedidoDeCompra", crearPedidoDeCompra);
router.post("/retraso", registrarRetraso);
router.post("/stock", actualizarStock);

export default router;