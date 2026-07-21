# FinFlow AI Backend - Detailed Project Guide

This guide provides a comprehensive overview of the architecture, technology stack, configuration, and development workflows for the FinFlow AI Backend.

---

## 1. Architecture Overview

We follow a **Modular Layered Architecture**. The project is divided into business modules (e.g., Auth, Expense, Upload) to ensure high scalability and easy maintenance.

### The Flow of a Request:
`Client` -> `Middleware (Auth/RateLimit/Validation)` -> `Routes` -> `Controllers` -> `Services` -> `Repositories` -> `Prisma/DB`

### Directory Structure:
- **`src/modules/`**: Contains business logic grouped by feature.
    - `routes/`: Endpoint definitions and Swagger annotations.
    - `controllers/`: Handles HTTP request/response.
    - `services/`: Complex business logic and external service calls.
    - `validators/`: Zod schemas for request body validation.
- **`src/repositories/`**: Centralized database access (Prisma).
- **`src/middlewares/`**: Shared logic like authentication, error handling, and security headers.
- **`src/config/`**: Configuration for AWS S3, Redis, Prisma, and Swagger.

---

## 2. Environment Configuration (`.env`)

The `.env` file is critical. Below is the breakdown of why each tech is used and how to configure it.

```env
# --- Server Config ---
PORT=3000
NODE_ENV=development # change to 'production' on AWS

# --- Database (Prisma + PostgreSQL) ---
# Used for persistent storage of users, expenses, and document metadata.
DATABASE_URL="postgresql://user:password@localhost:5432/finflow_ai?schema=public"

# --- Authentication (JWT) ---
# JWT_SECRET is used for access tokens (short-lived).
# JWT_REFRESH_SECRET is used for refresh tokens (long-lived) stored in DB.
JWT_SECRET="dummy_access_secret_for_local_dev_only"
JWT_REFRESH_SECRET="dummy_refresh_secret_for_local_dev_only"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="30d"

# --- Cloud Storage (AWS S3) ---
# Used for storing PDFs and images securely.
AWS_ACCESS_KEY_ID="AKIA_DUMMY_KEY_123"
AWS_SECRET_ACCESS_KEY="abc/123/dummy/secret/key"
AWS_REGION="eu-north-1"
S3_BUCKET_NAME="finflow-ai-docs"

# --- Caching & Rate Limiting (Redis) ---
# Used to prevent API abuse and store rate-limit counters.
# Falls back to MemoryStore if connection fails.
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=null

# --- Monitoring (Sentry) ---
# Used for real-time error tracking and performance profiling.
SENTRY_DSN="https://dummy_key@sentry.io/123456"

# --- Security ---
CORS_ORIGIN="http://localhost:3000"
```

---

## 3. Swagger Documentation

Interactive API documentation is available for both local and production environments. Use the **Authorize** button to test JWT-protected routes.

- **Local:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **AWS Production:** [http://56.228.4.142:3000/api-docs](http://56.228.4.142:3000/api-docs)

---

## 4. Development Workflow

### How to add a new Module:
1.  **Schema**: Update `prisma/schema.prisma` if new tables are needed.
2.  **Repository**: Create `src/repositories/newRepository.js` for DB queries.
3.  **Structure**: Create a folder in `src/modules/newFeature/` with:
    - `routes/`, `controllers/`, `services/`, `validators/`.
4.  **Register**: Import and use the new router in `src/app.js`.

### How to add a new API:
1.  Define a **Zod Schema** in `validators/` for input validation.
2.  Write the **Controller** logic and use the `successResponse` utility.
3.  Add **Swagger Annotations** above the route in `routes/` using the `@swagger` syntax.

---

## 5. Storage Rules (S3 Organization)

Files are stored using a strict hierarchy to support future AI processing:
- **Path**: `documents/{userId}/{docType}/{timestamp}-{originalname}`
- **docType**: Automatically categorized as `pdf`, `image`, or `other`.
- **Security**: Files are **Private**. Use `getPresignedUrl` from `s3Service.js` to generate temporary (1-hour) links.

---

## 6. Monitoring & Persistence Rules

### Prisma Rules:
- **Always** run `npx prisma generate` after changing the schema.
- Use `migrate dev` for local changes and `migrate deploy` for production.
- Keep repositories clean; do not put business logic in them.

### Sentry Rules:
- All `500` errors are automatically captured.
- Use `AppError` for operational errors (400, 401, 403, 404). These are NOT sent to Sentry to keep logs clean.
- Manual triggers: `Sentry.captureException(error)`.

---

## 7. AWS Deployment Checklist

After pulling code to AWS (Ubuntu/EC2):
1.  `npm install`
2.  `npx prisma migrate deploy`
3.  `npx prisma generate`
4.  `pm2 restart all`
5.  Check logs: `pm2 logs`
