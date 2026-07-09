# Add A New Module And Repository

Use this guide when adding a new backend module such as `budgets`, `reports`, `uploads`, or `ai`.

## 1. Create Module Folders

Example for `budget`:

```text
src/modules/budget/
|-- routes/
|   `-- budgetRoutes.js
|-- controllers/
|   `-- budgetController.js
|-- services/
|   `-- budgetService.js
`-- validators/
    `-- budgetValidator.js
```

## 2. Create Repository

```text
src/repositories/budgetRepository.js
```

Repository example:

```js
import prisma from "../config/prisma.js";

export const createBudget = async (data) => {
  return prisma.budget.create({ data });
};

export const findBudgetsByUserId = async (userId) => {
  return prisma.budget.findMany({
    where: { userId },
    orderBy: { id: "desc" },
  });
};
```

## 3. Create Validator

```js
import { z } from "zod";

export const createBudgetSchema = z.object({
  name: z.string().trim().min(2).max(50),
  amount: z.coerce.number().positive(),
});
```

## 4. Create Service

Business rules belong here.

```js
import { createBudget } from "../../../repositories/budgetRepository.js";

export const createBudgetService = async (userId, data) => {
  return createBudget({
    ...data,
    userId,
  });
};
```

## 5. Create Controller

```js
import { successResponse } from "../../../utils/apiResponse.js";
import { createBudgetService } from "../services/budgetService.js";

export const createBudget = async (req, res, next) => {
  try {
    const budget = await createBudgetService(req.user.userId, req.body);

    return successResponse(res, budget, "Budget created successfully", 201);
  } catch (error) {
    next(error);
  }
};
```

## 6. Create Routes

```js
import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { validate } from "../../../middlewares/validate.js";
import { createBudget } from "../controllers/budgetController.js";
import { createBudgetSchema } from "../validators/budgetValidator.js";

const router = Router();

router.post("/", authMiddleware, validate(createBudgetSchema), createBudget);

export default router;
```

## 7. Register Route In `src/app.js`

```js
import budgetRoutes from "./modules/budget/routes/budgetRoutes.js";

app.use("/api/budgets", budgetRoutes);
```

Later, when API versioning is added, prefer:

```js
app.use("/api/v1/budgets", budgetRoutes);
```

## Checklist

- Module folder created.
- Repository created.
- Zod validator added.
- Service contains business rules.
- Controller returns `successResponse`.
- Route uses `authMiddleware` if protected.
- Route uses `validate(schema)` for request body.
- Route registered in `app.js`.
- Prisma schema and migration added if a new table is needed.
- Tests added or planned.
