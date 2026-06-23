import { Router } from "express";
import { getActividad, crearActividad } from "../controllers/actividadController.js";

const router = Router();

router.get("/:obra_id", getActividad);
router.post("/", crearActividad);

export default router;
