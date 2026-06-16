import { successResponse } from "../utils/apiResponse.js";

export const healthCheck = (req, res) => {
  return successResponse(res, "API is healthy", {
    app: "FinFlow AI",
    status: "running",
  });
};
