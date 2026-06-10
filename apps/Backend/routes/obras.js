import { Router } from "express";
import {
  getObras,
  getObra,
  crearObra,
  updateObra,
  deleteObra,
  toggleStarred,
} from "../controllers/obrasController.js";

const router = Router();

// GET /obras
router.get("/obras", getObras);

// GET /obras/:obraId
router.get("/obras/:obraId", getObra);

// POST /obras
router.post("/obras", crearObra);

// PATCH /obras/:obraId
router.patch("/obras/:obraId", updateObra);

// DELETE /obras/:obraId
router.delete("/obras/:obraId", deleteObra);

// PATCH /obras/:obraId/starred
router.patch("/obras/:obraId/starred", toggleStarred);

export default router;