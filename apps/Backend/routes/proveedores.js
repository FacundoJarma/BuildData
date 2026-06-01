import { Router } from "express";
import { getProveedores, crearProveedor, vincularProveedor } from "../controllers/proveedoresController.js";

const router = Router();
router.get("/", getProveedores);
router.post("/", crearProveedor);
router.post("/vincular", vincularProveedor);
export default router;