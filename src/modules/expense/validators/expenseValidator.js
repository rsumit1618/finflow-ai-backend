import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().trim().max(255).optional(),
  categoryId: z.coerce.number().int().positive(),
  date: z.coerce.date().optional(),
});
