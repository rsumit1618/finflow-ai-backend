# Add A New API Endpoint

Use this guide when adding a new endpoint to an existing module.

Example: add `GET /api/expenses`.

## 1. Define Route

In `expenseRoutes.js`:

```js
router.get("/", authMiddleware, getExpenses);
```

If the route accepts query params, add a query validator or validate inside the controller.

## 2. Add Controller

Controller should be thin.

```js
export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await getExpensesService(req.user.userId, req.query);

    return successResponse(res, expenses, "Expenses fetched successfully");
  } catch (error) {
    next(error);
  }
};
```

## 3. Add Service

Service contains rules and defaults.

```js
export const getExpensesService = async (userId, filters) => {
  return findExpensesByUserId(userId, filters);
};
```

## 4. Add Repository Query

Repository contains Prisma query.

```js
export const findExpensesByUserId = async (userId) => {
  return prisma.expense.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
};
```

## 5. Add Validation

For body:

```js
router.post("/", authMiddleware, validate(createExpenseSchema), createExpense);
```

For params/query, add schema parsing in controller or create dedicated middleware later.

Example:

```js
const id = Number(req.params.id);

if (!Number.isInteger(id) || id <= 0) {
  throw new AppError("Invalid resource id", 400);
}
```

## 6. Response Format

Always use:

```js
successResponse(res, data, "Message", statusCode);
```

Response shape:

```json
{
  "success": true,
  "message": "Expenses fetched successfully",
  "data": []
}
```

## 7. Error Format

Throw operational errors:

```js
throw new AppError("Expense not found", 404);
```

Do not manually return different error shapes from every controller.

## Checklist

- Route added.
- Controller added.
- Service added.
- Repository query added.
- Zod validation added.
- User ownership checked.
- Response uses `successResponse`.
- Errors use `AppError`.
- Route tested manually or with Supertest.
