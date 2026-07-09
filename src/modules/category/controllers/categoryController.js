import { successResponse } from "../../../utils/apiResponse.js";
import {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categoryService.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categoryValidator.js";
import { AppError } from "../../../utils/AppError.js";

const parseId = (value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid resource id", 400);
  }

  return id;
};

export const createCategory = async (req, res, next) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    const category = await createCategoryService(req.user.userId, validatedData);

    return successResponse(
      res,
      category,
      "Category created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await getCategoriesService(req.user.userId);

    return successResponse(
      res,
      categories,
      "Categories fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await getCategoryByIdService(
      parseId(req.params.id),
      req.user.userId
    );

    return successResponse(
      res,
      category,
      "Category fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const validatedData = updateCategorySchema.parse(req.body);

    const category = await updateCategoryService(
      parseId(req.params.id),
      req.user.userId,
      validatedData
    );

    return successResponse(
      res,
      category,
      "Category updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await deleteCategoryService(parseId(req.params.id), req.user.userId);

    return successResponse(
      res,
      null,
      "Category deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};
