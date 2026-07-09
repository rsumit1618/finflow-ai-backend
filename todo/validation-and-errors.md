# Validation And Error Handling

## Why Zod

Zod protects the API boundary. The backend should never trust frontend input.

Use Zod for:

- Required fields.
- String length.
- Email format.
- Number coercion.
- Positive IDs.
- Date parsing.
- Optional fields.

Example:

```js
import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().trim().max(255).optional(),
  categoryId: z.coerce.number().int().positive(),
  date: z.coerce.date().optional(),
});
```

## How To Use Validator Middleware

```js
router.post("/", authMiddleware, validate(createExpenseSchema), createExpense);
```

The middleware parses `req.body` and replaces it with validated data.

## AppError Pattern

Use `AppError` for expected business errors:

```js
throw new AppError("Category not found", 404);
```

Common status codes:

- `400`: invalid request.
- `401`: not authenticated.
- `403`: authenticated but not allowed.
- `404`: record not found.
- `409`: duplicate/conflict.
- `429`: too many requests.
- `500`: unexpected server error.

## Global Error Handler

All controllers should use:

```js
try {
  // controller logic
} catch (error) {
  next(error);
}
```

The global error handler converts errors into a consistent response.

## Do Not Do This

Avoid different custom error shapes in each controller:

```js
return res.status(400).json({ error: "Bad input" });
```

Prefer:

```js
throw new AppError("Bad input", 400);
```

## Validation Checklist

- Every POST/PUT/PATCH route has Zod validation.
- User-controlled IDs are validated.
- Query filters are validated.
- Strings are trimmed.
- Money is positive and stored as Decimal.
- File upload metadata is validated.
- Error response shape stays consistent.
