# Architecture And Packages

## Main Packages Used

Runtime:

- `express`: HTTP server and routing.
- `@prisma/client`: database client generated from Prisma schema.
- `prisma`: migration and schema tooling.
- `zod`: request validation.
- `jsonwebtoken`: JWT access token handling.
- `bcryptjs`: password hashing.
- `cors`: CORS policy.
- `dotenv`: environment variable loading.

Development:

- `nodemon`: local development server reload.
- `eslint`: code scanning and maintainability rules.
- `prettier`: code formatting.

Future planned packages:

- `jest`: unit tests.
- `supertest`: API integration tests.
- `swagger-ui-express`: API documentation UI.
- `multer`: file uploads.
- `helmet`: production security headers.
- `winston`: structured logs.

## Why We Use Layers

### Routes

Routes only define URL, HTTP method, and route middleware.

Example:

```js
router.post("/", authMiddleware, validate(createExpenseSchema), createExpense);
```

### Controllers

Controllers handle HTTP-specific work:

- Read `req.params`, `req.body`, `req.user`.
- Call the service.
- Return a response with `successResponse`.
- Forward errors with `next(error)`.

### Services

Services contain business rules:

- Check ownership.
- Check permissions.
- Throw `AppError`.
- Coordinate multiple repositories.

### Repositories

Repositories contain Prisma queries only.

Why:

- Keeps database logic in one place.
- Makes services easier to test.
- Makes query changes safer.
- Prevents controllers from becoming messy.

### Validators

Validators use Zod to protect the API boundary.

Use validators for:

- Body payloads.
- Query params.
- IDs and filters.
- Uploaded metadata.

## Shared Utilities

- `src/utils/apiResponse.js`: consistent success response shape.
- `src/utils/AppError.js`: operational errors with HTTP status codes.
- `src/middlewares/errorMiddleware.js`: central error handling.
- `src/middlewares/validate.js`: reusable Zod validator middleware.
