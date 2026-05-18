import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";

const router = Router();

// GET /dashboard/:obra_id
router.get("/:obra_id", getDashboard);

export default router;