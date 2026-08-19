import { Router } from "express";
import { aprobarPedido, rechazarPedido } from "../controllers/pedidosController.js";

const router = Router();

router.patch("/:id/aprobar", aprobarPedido);
router.patch("/:id/rechazar", rechazarPedido);

export default router;
