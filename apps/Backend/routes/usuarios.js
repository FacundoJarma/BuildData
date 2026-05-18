import { Router } from "express";
import { getEquipo, crearUsuario, asignarObra } from "../controllers/usuariosController.js";

const router = Router();

router.get("/:obra_id", getEquipo);
router.post("/", crearUsuario);
router.post("/asignar-obra", asignarObra);

export default router;