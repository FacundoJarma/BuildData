import { Router } from "express";
import { getReportes, crearReporte } from "../controllers/reportesController.js";

const router = Router();

router.get("/:obra_id", getReportes);
router.post("/", crearReporte);

export default router;