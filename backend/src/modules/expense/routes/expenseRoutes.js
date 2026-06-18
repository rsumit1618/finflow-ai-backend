import { Router } from "express";
import { createExpense } from "../controllers/expenseController.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { validate } from "../../../middlewares/validate.js";
import { createExpenseSchema } from "../validators/expenseValidator.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createExpenseSchema),
  createExpense
);

export default router;