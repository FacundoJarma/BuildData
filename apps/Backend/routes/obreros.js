import express from "express";

import {
  getObreros,
  asignarObraObrero,
  quitarObreroDeObra,
} from "../controllers/obrerosController.js";

const router = express.Router();

router.get("/:obra_id", getObreros);

router.post("/asignar-obra", asignarObraObrero);

router.delete(
  "/:obrero_id/obra/:obra_id",
  quitarObreroDeObra
);

export default router;