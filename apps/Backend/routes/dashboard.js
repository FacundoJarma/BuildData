import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";

const router = Router();

// GET /dashboard/:obraId
router.get("/:obraId", getDashboard);

export default router;