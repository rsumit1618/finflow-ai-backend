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

export const updateCategory = async (id, data) => {
  return await prisma.category.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: {
      id,
    },
  });
};
