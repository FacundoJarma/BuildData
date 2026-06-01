import { Router } from "express";
import { getGastos, crearGasto } from "../controllers/gastosController.js";

const router = Router();
router.get("/:obra_id", getGastos);
router.post("/", crearGasto);
export default router;