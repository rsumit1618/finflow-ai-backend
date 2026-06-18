import {
  getCategoryById,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../../../repositories/categoryRepository.js";

export const createCategoryService = async (data) => {
  return await createCategory(data);
};

export const getCategoriesService = async () => {
  return await getAllCategories();
};

export const getCategoryByIdService = async (id) => {
  const category = await getCategoryById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const updateCategoryService = async (id, data) => {
  const category = await getCategoryById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return await updateCategory(id, data);
};

export const deleteCategoryService = async (id) => {
  const category = await getCategoryById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  await deleteCategory(id);
};