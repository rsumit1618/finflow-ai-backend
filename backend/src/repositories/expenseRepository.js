import prisma from "../config/prisma.js";

export const createExpense = async (data) => {
  return await prisma.expense.create({
    data,
  });
};