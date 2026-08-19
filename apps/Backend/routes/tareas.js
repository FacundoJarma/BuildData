import { Router } from "express";
import { getTareas, crearTarea, actualizarTarea } from "../controllers/tareasController.js";

const router = Router();

router.get("/:obra_id", getTareas);
router.post("/", crearTarea);
router.patch("/:id", actualizarTarea);

export default router;