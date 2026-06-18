import { createExpenseService } from "../services/expenseService.js";
import { successResponse } from "../../../utils/apiResponse.js";
import prisma from "../../../config/prisma.js";

export const createExpense = async (req, res) => {
  try {
    const { amount, description, categoryId } = req.body;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const expense = await prisma.expense.create({
      data: {
        amount,
        description,
        categoryId,
        userId: req.user.userId,
      },
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};