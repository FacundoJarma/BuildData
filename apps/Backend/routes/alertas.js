import { Router } from "express";
import { getAlertas, resolverAlerta, crearAlerta } from "../controllers/alertasController.js";

const router = Router();

router.get("/:obra_id", getAlertas);
router.patch("/:id/resolver", resolverAlerta);
router.post("/", crearAlerta);

export default router;