# FinFlow AI Backend

Production-oriented Express and Prisma API for FinFlow AI. The backend is organized by business module so multiple developers can work independently on auth, categories, expenses, and future finance features without stepping on each other.

## Stack

- Node.js with Express
- PostgreSQL with Prisma ORM
- JWT authentication
- Zod request validation
- ESLint and Prettier for maintainable code style

## Project Structure

```text
backend/
|-- server.js
|-- eslint.config.js
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
`-- src/
    |-- app.js
    |-- config/
    |   |-- env.js
    |   `-- prisma.js
    |-- middlewares/
    |-- modules/
    |   |-- auth/
    |   |-- category/
    |   |-- expense/
    |   `-- health/
    |-- repositories/
    |-- utils/
    `-- constants/
```

## Module Pattern

Each feature module follows this flow:

```text
routes -> controllers -> services -> repositories -> database
```

- `routes`: URL mapping and route-level middleware.
- `controllers`: HTTP request and response handling.
- `services`: business rules, authorization checks, and domain errors.
- `repositories`: Prisma database access only.
- `validators`: Zod schemas for input validation.

This keeps modules easy to scan, test, and split across team members.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Set real values in `.env`, especially:

```text
DATABASE_URL
JWT_SECRET
CORS_ORIGIN
```

4. Apply database migrations:

```bash
npx prisma migrate dev
```

5. Start development server:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm start       # run production entrypoint
npm run dev     # run with nodemon
npm run lint    # run ESLint
npm run format  # format with Prettier
```

## API Health

```http
GET /api/health
```

Returns service status, service name, and timestamp. This endpoint is suitable for AWS load balancer or container health checks.

## Security Baseline

Current backend protections include:

- Required environment validation for `JWT_SECRET` and `DATABASE_URL`.
- JWT auth middleware for protected routes.
- Auth rate limiting for login and registration.
- Security headers for content type, framing, referrer policy, and permissions policy.
- Configurable CORS through `CORS_ORIGIN`.
- Zod validation with consistent `400` responses.
- Central `AppError` type for predictable operational errors.
- User-scoped categories to prevent cross-user data access.
- Decimal storage for financial amounts instead of floating point.

For AWS production, also configure:

- AWS WAF for managed rules and IP/rate throttling.
- HTTPS only through ALB or CloudFront.
- Secrets Manager or SSM Parameter Store for secrets.
- RDS PostgreSQL with backups, encryption, and private networking.
- CloudWatch logs, metrics, alarms, and structured request tracing.
- CI checks for linting, tests, Prisma validation, and dependency scanning.

## Data Model Notes

- `User` owns `Category` and `Expense`.
- `Category` is unique per user by name.
- `Expense.amount` uses `Decimal(12, 2)` for finance-safe persistence.
- Expense category lookup is scoped to the authenticated user.

## Team Workflow

- Create or change one module at a time under `src/modules/<feature>`.
- Keep shared logic in `middlewares`, `utils`, or `repositories` only when multiple modules need it.
- Add migrations for every schema change.
- Do not commit `.env`; use `.env.example` for required keys.
- Run `npm run lint` and `npx prisma validate` before opening a PR.
