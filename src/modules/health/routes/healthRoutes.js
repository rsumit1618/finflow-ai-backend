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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         status: { type: string, example: "ok" }
 *                         service: { type: string, example: "finflow-ai-backend" }
 *                         timestamp: { type: string, format: "date-time" }
 */
router.get("/", (req, res) => {
  healthResponse(res, {
    status: "ok",
    service: "finflow-ai-backend",
    timestamp: new Date().toISOString(),
  });
});

export default router;
