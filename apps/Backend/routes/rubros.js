import { Router } from "express";
import {
  getRubros,
  crearRubro,
  updateRubro,
  deleteRubro,
} from "../controllers/rubros.controller.js";

const router = Router();

// GET /obras/:obraId/rubros
router.get("/obras/:obraId/rubros", getRubros);

// POST /obras/:obraId/rubros
router.post("/obras/:obraId/rubros", crearRubro);

// PATCH /obras/:obraId/rubros/:rubroId
router.patch("/obras/:obraId/rubros/:rubroId", updateRubro);

// DELETE /obras/:obraId/rubros/:rubroId
router.delete("/obras/:obraId/rubros/:rubroId", deleteRubro);

export default router;