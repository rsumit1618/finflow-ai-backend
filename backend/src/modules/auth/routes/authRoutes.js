import express from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { createRateLimiter } from "../../../middlewares/rateLimitMiddleware.js";
import {
  changePassword,
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "../controllers/authController.js";

const router = express.Router();
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  keyPrefix: "auth",
});

router.post("/register", authRateLimiter, registerUser);
router.post("/login", authRateLimiter, loginUser);
router.post("/change-password", authMiddleware, changePassword);
router.post("/logout", authMiddleware, logoutUser);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);


export default router;
