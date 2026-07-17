# FinFlow AI — Interview Questions & Answers (10+ years JavaScript/NodeJS)

> Docs are based on the current codebase structure and the technologies already used in this project.

---

## 1) Node.js + JavaScript fundamentals (what a senior should know)

### Q1. Why use Node.js (and Express) for this type of backend?
**A.** Node.js is good for I/O-bound workloads (DB calls, Redis, S3, network calls). Express provides a pragmatic middleware pipeline and routing model. For this project specifically, the request flow is:
- Auth / validation middleware
- Business logic in services
- Persistence through Prisma repositories
- Side effects in S3 uploads
- Centralized error handling

### Q2. What does “event loop” mean for API performance?
**A.** Node handles concurrency through an event loop. CPU-heavy tasks block the loop; therefore:
- Hashing/crypto should be used carefully (bcrypt is async-friendly here).
- Avoid synchronous loops for large payloads.
- Use caching/queues for heavy or bursty work (recommended later in scaling notes).

### Q3. ES Modules (`import/export`) in Node — benefits?
**A.** ES Modules are more explicit, align with modern tooling, and reduce ambiguity of CommonJS interop. The project uses `type: module`-style imports (e.g., `import app from "./src/app.js"`).

---

## 2) Express architecture used in this project

### Q4. What pattern is the project using for maintainability?
**A.** A modular layering approach:
- **routes**: input mapping (URL + HTTP method)
- **controllers**: request/response orchestration + validation parsing
- **services**: business rules and workflows
- **repositories**: persistence logic (Prisma)
- **middlewares**: cross-cutting concerns (auth, rate limiting, errors, logging)

This separation reduces coupling and makes unit testing practical.

### Q5. Where are cross-cutting concerns implemented?
**A.** In `src/middlewares/*`:
- `requestIdMiddleware.js` adds request correlation id
- `loggerMiddleware.js` logs request duration and metadata
- `securityMiddleware.js` sets security headers
- `rateLimitMiddleware` + `express-rate-limit` enforce throttling
- `authMiddleware.js` validates JWT
- `errorMiddleware.js` provides global error handling

---

## 3) Authentication & Authorization (JWT + Refresh Tokens)

### Q6. What authentication mechanism is implemented?
**A.** JWT access tokens + refresh tokens.
- Access token: short-lived (`JWT_EXPIRES_IN`)
- Refresh token: longer-lived (`JWT_REFRESH_EXPIRES_IN`)

### Q7. How are refresh tokens handled securely?
**A.** Instead of storing raw refresh tokens, the project stores a **SHA-256 hash** of the refresh token:
- `hashToken(refreshToken)` via `crypto.createHash("sha256")`
- stored in DB (`refreshTokenRepository`)
- on refresh: compute hash, verify active token, then rotate/revoke

### Q8. What is “refresh token reuse detection”?
**A.** If an already-revoked refresh token is used again, the project detects reuse:
- `findActiveRefreshTokenByHash(tokenHash)` returns null
- it revokes all tokens for the user
- throws `Refresh token reuse detected`

This is a major security hardening technique.

### Q9. Where is JWT verification performed?
**A.** In `src/middlewares/authMiddleware.js` via `jwt.verify(token, env.jwtSecret)`.

---

## 4) Input validation & schema-driven APIs (Zod)

### Q10. Why use Zod for validation?
**A.** It provides:
- runtime validation
- structured error reporting (`ZodError` issues)
- a single source of truth for API payload shape

### Q11. How validation errors are handled globally?
**A.** `globalErrorHandler` checks:
- `err instanceof ZodError` → HTTP 400 + `details = err.issues`

Controllers also sometimes parse explicitly (e.g., `registerSchema.parse(req.body)`), and a generic `validate(schema)` middleware exists.

---

## 5) Rate limiting (Redis-backed, distributed)

### Q12. Why rate limit at the API gateway/app level?
**A.** To protect availability, reduce abuse, and keep your DB/S3 from overload during spikes.

### Q13. How is rate limiting implemented?
**A.** In `src/app.js` using `express-rate-limit` + `rate-limit-redis`.
- Uses Redis store when Redis is ready
- Falls back to default MemoryStore if Redis is not available

Key code behaviors:
- `windowMs: 10s` (short window)
- `max: 100`
- `keyGenerator` uses `x-forwarded-for` or `req.ip`
- `skip` exempts swagger docs and supports `x-bypass-rate-limit`

### Q14. What is a potential interview-level caveat?
**A.** MemoryStore is **not distributed**. On multi-instance deployments, MemoryStore would allow more requests per instance. The project tries to avoid that by using Redis. For strict consistency at scale, Redis is required.

---

## 6) Centralized error handling (global vs local)

### Q15. What is “global error handling” in Express?
**A.** A centralized error middleware captures errors from all routes.
- Here: `notFoundHandler` (404) + `globalErrorHandler`.

### Q16. What does the global error handler classify?
**A.** It maps errors to HTTP status codes:
- `ZodError` → 400 (Validation failed)
- `AppError` or `err.isOperational` → uses `err.statusCode`
- Prisma:
  - `P2002` → 409 Duplicate record
  - `P2025` → 404 Record not found

### Q17. What is “local error handling”?
**A.** Some controllers wrap logic in `try/catch` and call `next(error)`.
Local decisions:
- return specific responses directly (sometimes), or
- convert to domain errors via `AppError`.

### Q18. How is Sentry integrated with errors?
**A.**
- `initSentry()` configures Sentry
- `Sentry.setupExpressErrorHandler(app)` wires Express handler
- `globalErrorHandler` also calls `Sentry.captureException(err)` for 5xx

---

## 7) Logging & observability

### Q19. What logging strategy is used?
**A.** Structured JSON logs on response `finish` event.
Logged fields:
- timestamp
- requestId
- method/path
- statusCode
- durationMs
- ip/userAgent

### Q20. Why add a request id?
**A.** It enables correlation across:
- app logs
- distributed tracing (recommended)
- Sentry events

Currently request id is generated via `x-request-id` or `crypto.randomUUID()`.

---

## 8) Security headers & basic hardening

### Q21. What security headers are set?
**A.** In `securityMiddleware.js`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy`

### Q22. What else is missing (recommended)?
**A.** Not all production security controls are implemented in code:
- HTTPS enforcement / HSTS
- rate limit tuning per route (different limits for auth vs expensive endpoints)
- CSRF protection (not applicable for pure JWT APIs unless cookies)
- secure cookie flags (if later using cookie-based auth)
- Web Application Firewall (WAF)

---

## 9) S3 uploads & presigned URLs

### Q23. How does file upload work?
**A.** `s3Service.js` wraps AWS SDK v3:
- `uploadFile(fileBuffer, fileName, contentType)` uses `PutObjectCommand`
- `getPresignedUrl(fileName)` uses `GetObjectCommand` + `getSignedUrl` with expiry 3600s
- `deleteFile(fileName)` uses `DeleteObjectCommand`

### Q24. Why presigned URLs?
**A.** You avoid making the bucket public. Clients can access files securely for a limited time.

### Q25. What is the scalability concern with synchronous uploads?
**A.** Upload endpoints can be expensive and slow. For high throughput:
- consider streaming upload
- impose file size limits
- use async background processing for virus scanning / OCR

---

## 10) Swagger / OpenAPI documentation

### Q26. Why is swagger important for interviews?
**A.** It improves developer experience, enables client generation, and clarifies contract correctness.

### Q27. How is swagger configured?
**A.** In `src/config/swagger.js`:
- OpenAPI 3.0
- `apis: ['./src/modules/**/*.js', './src/modules/**/routes/*.js']`
- server URL depends on `NODE_ENV`

---

## 11) Scalability, maintainability, multi-instance (“global”) design

### Q28. What makes the project maintainable?
**A.**
- Clear separation (controllers/services/repositories/middlewares)
- Central error handling
- Reusable helpers (`apiResponse`, `AppError`, pagination)
- Infrastructure concerns isolated in `src/config/*` (Redis/S3/Sentry/Swagger)

### Q29. What makes the project scalable across multiple instances?
**A.** The primary “global”/shared components are:
- **Redis rate limiting** (distributed throttle)
- **PostgreSQL** as the shared source of truth
- **S3** for object storage (scales independently of app servers)
- **PM2 cluster mode** + Nginx reverse proxy (in deployment strategy)

### Q30. Can it handle ~1,000,000 users?
**A. (Practical answer)**
- The architecture is a good starting point (stateless API, Redis, Postgres, S3).
- However, “1 million users” depends on request volume per second, query patterns, DB indexing, caching strategy, and operational tuning.

What the code already supports:
- distributed rate limiting (Redis)
- centralized errors for consistent behavior
- request logging and Sentry visibility

What you should add for real 1M-scale reliability (recommended):
1. **Database indexing & query optimization** (Prisma-level + DB-level indexes)
2. **Cache hot reads** (Redis caching layer)
3. **Async jobs** for long tasks (queue like SQS/RabbitMQ/BullMQ)
4. **Request timeouts** and **circuit breakers**
5. **Horizontal scaling** behind load balancer (ALB/NGINX)

### Q31. Is error handling “global” and “local”?
**A.** Yes.
- Global: `notFoundHandler` + `globalErrorHandler`.
- Local: controllers catch and forward errors via `next(error)`.

This results in consistent HTTP responses and centralized observability.

---

## 12) FAQ Sheet (common interview + real-world user concerns)

### Q32. At peak hour, will the project handle the traffic?
**A.** The app includes **rate limiting** and is designed for multi-instance deployment (PM2 cluster + Nginx). For peak-hour stability:
- Redis rate limiting prevents request floods.
- stateless design allows horizontal scaling.

But to guarantee peak stability at extreme loads, you must also:
- configure load balancer auto-scaling
- ensure DB indexes and connection pooling
- add caching and async jobs for heavy work

### Q33. How do you handle “global” failure scenarios?
**A.**
- Sentry captures 5xx errors.
- Global error middleware ensures consistent responses.
- Not-found handler prevents leaking internal routes.

### Q34. What text did you use to answer the questions?
**A.** This document is derived from the current repository code structure and implementations (middleware behavior, JWT logic, S3 service wrappers, swagger config, and global error handling patterns).

### Q35. What more tech can be used to handle billion users?
**A. (Recommended roadmap for massive scale)**
- **API Gateway / WAF**: Cloudflare/AWS WAF to block abusive traffic earlier
- **Load balancers with auto-scaling**: ALB/NLB + HPA
- **CDN for static and generated assets**
- **Advanced caching**: Redis caching of read-heavy endpoints
- **Read replicas** for Postgres
- **Sharding / partitioning** for very large datasets
- **Async queues** for uploads processing, notifications, analytics
- **Observability stack**: OpenTelemetry + distributed tracing + metrics (Prometheus/Grafana)
- **End-to-end encryption** beyond app boundaries (see next)

### Q36. End-to-end encryption: is it fully implemented?
**A.** Not fully in this codebase. What’s currently implied:
- TLS/HTTPS should be enabled at the infrastructure level (Nginx/ALB). This encrypts data in transit.

Not covered in code:
- payload-level encryption between client and server
- field-level encryption in the database
- client-side key management

**Recommended for a production product**:
- HTTPS everywhere (HSTS)
- AWS KMS for S3 and optionally for DB field encryption
- Consider encrypting sensitive fields at rest (application-level or transparent encryption)

---

## 13) “Missing tech” list (explicitly recommended for production)

This project does not fully cover (in code) the following production-grade capabilities. They are strongly recommended for a real product:

- **HTTPS enforcement + HSTS**
- **CSRF strategy** (only if cookies are used)
- **Distributed tracing** (OpenTelemetry)
- **Circuit breakers / bulkheads** for external dependencies
- **Comprehensive rate limits per route/user tier**
- **Background job processing** for heavy tasks (virus scanning, OCR, etc.)
- **Field-level encryption for sensitive data** if needed
- **Robust cache invalidation** strategy

---

## 14) Quick “interview answers” checklist (for 10-year devs)

- Explain middleware pipeline and separation of concerns
- Explain JWT access/refresh flows and refresh rotation/reuse detection
- Explain Redis-backed rate limiting vs MemoryStore limitations
- Explain Zod validation and ZodError mapping
- Explain global error handling and AppError operational errors
- Explain request correlation IDs and structured logging
- Explain S3 presigned URL security model
- Explain horizontal scaling constraints (DB pooling, indexes)
- Explain what you would add for 1M → 1B scale

