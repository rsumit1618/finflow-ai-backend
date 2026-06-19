import {
  getCategoryById,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../../../repositories/categoryRepository.js";
import { AppError } from "../../../utils/AppError.js";

export const createCategoryService = async (userId, data) => {
  return await createCategory({
    ...data,
    userId,
  });
};

export const getCategoriesService = async (userId) => {
  return await getAllCategories(userId);
};

export const getCategoryByIdService = async (id, userId) => {
  const category = await getCategoryById(id, userId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const updateCategoryService = async (id, userId, data) => {
  const category = await getCategoryById(id, userId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("No category fields provided", 400);
  }

  return await updateCategory(id, data);
};

export const deleteCategoryService = async (id, userId) => {
  const category = await getCategoryById(id, userId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  await deleteCategory(id);
};
