import { createExpense } from "../../../repositories/expenseRepository.js";

export const createExpenseService = async (data) => {
  return await createExpense(data);
};