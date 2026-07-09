import {
  createExpense,
  findCategoryByIdForUser,
} from "../../../repositories/expenseRepository.js";
import { AppError } from "../../../utils/AppError.js";

export const createExpenseService = async ({
  amount,
  description,
  categoryId,
  userId,
}) => {
  const category = await findCategoryByIdForUser(categoryId, userId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return createExpense({
    amount,
    description,
    categoryId,
    userId,
  });
};
