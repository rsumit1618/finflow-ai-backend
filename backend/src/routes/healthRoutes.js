import express from "express";
import { healthCheck } from "../controllers/healthController.js";
import { ROUTES } from "../constants/appConstants.js";

const router = express.Router();

router.get(ROUTES.HEALTH, healthCheck);

export default router;
