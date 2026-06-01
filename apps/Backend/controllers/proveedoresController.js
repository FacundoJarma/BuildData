import { Router } from "express";
import { getMateriales, crearMaterial, actualizarMaterial } from "../controllers/materialesController.js";

const router = Router();
router.get("/:obra_id", getMateriales);
router.post("/", crearMaterial);
router.patch("/:id", actualizarMaterial);
export default router;