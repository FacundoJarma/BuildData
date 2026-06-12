import { Router } from "express";
import {
  getRubros,
  crearRubro,
  updateRubro,
  deleteRubro,
} from "../controllers/rubrosController.js";

const router = Router();

router.get("/obras/:obraId/rubros", getRubros);
router.post("/obras/:obraId/rubros", crearRubro);
router.patch("/obras/:obraId/rubros/:rubroId", updateRubro);
router.delete("/obras/:obraId/rubros/:rubroId", deleteRubro);

export default router;