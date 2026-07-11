import { Router } from "express";
import { createExpense } from "../controllers/expenseController.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { validate } from "../../../middlewares/validate.js";
import { createExpenseSchema } from "../validators/expenseValidator.js";

const router = Router();

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, categoryId]
 *             properties:
 *               amount: { type: number }
 *               description: { type: string }
 *               date: { type: string, format: date-time }
 *               categoryId: { type: integer }
 *     responses:
 *       201:
 *         description: Expense created successfully
 */
router.post(
  "/",
  authMiddleware,
  validate(createExpenseSchema),
  createExpense
);

export default router;