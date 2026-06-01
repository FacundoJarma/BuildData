import { Router } from "express";
import { getObreros, registrarObrero, quitarObreroDeObra, getObrasPorTelefono} from "../controllers/obrerosController.js";



const router = Router();

router.get("/:obra_id", getObreros);
router.post("/registrar", registrarObrero);
router.delete("/:obrero_id/obra/:obra_id", quitarObreroDeObra);
router.get("/telefono/:telefono", getObrasPorTelefono);

export default router;