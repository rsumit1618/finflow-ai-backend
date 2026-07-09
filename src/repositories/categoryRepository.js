import prisma from "../config/prisma.js";

export const createCategory = async (data) => {
  return await prisma.category.create({
    data,
  });
};

export const getAllCategories = async (userId) => {
  return await prisma.category.findMany({
    where: {
      userId,
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const getCategoryById = async (id, userId) => {
  return await prisma.category.findFirst({
    where: {
      id,
      userId,
    },
  });
};

export const updateCategoryForUser = async (id, userId, data) => {
  return prisma.category.updateMany({
    where: {
      id,
      userId,
    },
    data,
  });
};

export const deleteCategoryForUser = async (id, userId) => {
  return prisma.category.deleteMany({
    where: {
      id,
      userId,
    },
  });
};
