import { Router } from "express";
import { getTareas, crearTarea, actualizarTarea, crearSubtarea } from "../controllers/tareasController.js";

const router = Router();

router.get("/:obra_id", getTareas);
router.post("/", crearTarea);
router.patch("/:id", actualizarTarea);
router.post("/:tarea_id/subtareas", crearSubtarea);

export default router;