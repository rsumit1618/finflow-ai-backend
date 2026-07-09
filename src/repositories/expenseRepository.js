import prisma from "../config/prisma.js";

export const createExpense = async (data) => {
  return prisma.expense.create({
    data,
  });
};

export const findCategoryByIdForUser = async (id, userId) => {
  return prisma.category.findFirst({
    where: {
      id,
      userId,
    },
  });
};
