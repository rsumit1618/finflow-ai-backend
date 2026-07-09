import { createExpenseService } from "../services/expenseService.js";
import { successResponse } from "../../../utils/apiResponse.js";

export const createExpense = async (req, res, next) => {
  try {
    const expense = await createExpenseService({
      ...req.body,
      userId: req.user.userId,
    });

    return successResponse(
      res,
      expense,
      "Expense created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};