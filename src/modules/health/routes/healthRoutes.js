import { Router } from "express";
import { healthResponse } from "../../../utils/apiResponse.js";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get("/", (req, res) => {
  healthResponse(res, {
    status: "ok",
    service: "finflow-ai-backend",
    timestamp: new Date().toISOString(),
  });
});

export default router;
