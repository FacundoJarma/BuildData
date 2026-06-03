import { Router } from "express";
import { getPresupuestos, crearPresupuesto, actualizarPresupuesto } from "../controllers/presupuestosController.js";

const router = Router();
router.get("/", getPresupuestos);
router.post("/", crearPresupuesto);
router.patch("/:id", actualizarPresupuesto);
export default router;