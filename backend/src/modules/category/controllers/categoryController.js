import { successResponse } from "../../../utils/apiResponse.js";
import {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categoryService.js";
import { createCategorySchema } from "../validators/categoryValidator.js";

export const createCategory = async (req, res, next) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    const category = await createCategoryService(validatedData);

    return successResponse(
      res,
      "Category created successfully",
      category,
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await getCategoriesService();

    return successResponse(
      res,
      "Categories fetched successfully",
      categories
    );
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await getCategoryByIdService(Number(req.params.id));

    return successResponse(
      res,
      "Category fetched successfully",
      category
    );
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await updateCategoryService(
      Number(req.params.id),
      req.body
    );

    return successResponse(
      res,
      "Category updated successfully",
      category
    );
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await deleteCategoryService(Number(req.params.id));

    return successResponse(
      res,
      "Category deleted successfully",
      null
    );
  } catch (error) {
    next(error);
  }
};