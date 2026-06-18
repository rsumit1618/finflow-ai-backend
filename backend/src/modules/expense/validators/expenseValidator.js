import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional(),
  categoryId: z.number(),
});