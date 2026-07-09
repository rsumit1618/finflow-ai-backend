import { Router } from "express";
import { healthResponse } from "../../../utils/apiResponse.js";

const router = Router();

router.get("/", (req, res) => {
  healthResponse(res, {
    status: "ok",
    service: "finflow-ai-backend",
    timestamp: new Date().toISOString(),
  });
});

export default router;
