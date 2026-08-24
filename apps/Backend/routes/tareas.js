import { Router } from "express";
import { getTareas, crearTarea, actualizarTarea, completarTarea } from "../controllers/tareasController.js";

const router = Router();

router.get("/:obra_id", getTareas);
router.post("/", crearTarea);
router.post("/:id/completar", completarTarea);
router.patch("/:id", actualizarTarea);

export default router;