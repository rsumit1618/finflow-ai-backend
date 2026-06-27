# Project Roadmap And Next Steps

This file is the handoff note for future AI agents and developers.

FinFlow AI is not only an expense CRUD app. It is intended to become a production-style personal finance SaaS that teaches Flutter, Node.js, PostgreSQL, AWS free-tier deployment, Docker, CI/CD, security, SSL, monitoring, and AI integration.

## Current Stage

```text
Stage 0: Project Vision + Roadmap        Done
Stage 1: Backend Foundation              Mostly Done
Stage 2: Auth Security Upgrade           Next
Stage 3: Testing + API Docs              Next
Stage 4: Docker + Local DevOps           Later
Stage 5: AWS EC2 Deployment              Later
Stage 6: Nginx + SSL + PM2               Later
Stage 7: S3 Uploads                      Later
Stage 8: CloudWatch + Monitoring         Later
Stage 9: CI/CD                           Later
Stage 10: AI Features                    Later
```

We are currently at:

```text
Stage 1 completed enough to move forward.
Stage 2 is the next best step.
```

## Already Done

- Project roadmap README.
- Backend README.
- Backend `todo` guide folder.
- Express backend setup.
- Prisma + PostgreSQL setup.
- User, Category, Expense, and RefreshToken models.
- Auth register/login/profile APIs.
- Category APIs.
- Expense create API.
- Health API.
- API versioning with `/api/v1/...`.
- Backward-compatible old `/api/...` routes.
- Central error handling.
- `AppError` utility.
- Zod validation.
- JWT auth middleware.
- Request ID middleware.
- Structured JSON logger.
- Rate limiter.
- Security headers.
- User-scoped categories.
- Decimal money storage.
- Prisma migrations.
- ESLint setup.
- Pagination utility.

## Stage 2: Auth Security Upgrade

This is the next priority.

TODO:

- Implement refresh token logic.
- Store only hashed refresh tokens.
- Add refresh token rotation.
- Detect refresh token reuse.
- Add logout token revocation.
- Add logout-all-devices support.
- Add session/device tracking fields if needed.
- Add protected route tests.
- Improve password policy.
- Consider shorter access token expiry.

Expected endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout
POST /api/v1/auth/logout-all
GET  /api/v1/auth/profile
PUT  /api/v1/auth/profile
POST /api/v1/auth/change-password
```

Important rule:

```text
Never store refresh tokens in plain text.
Store token hashes only.
```

## Stage 3: Backend Testing

TODO:

- Install `jest` and `supertest`.
- Add Jest config if needed.
- Add test database strategy.
- Add health route test.
- Add auth register/login tests.
- Add auth validation tests.
- Add category ownership tests.
- Add expense category ownership tests.
- Add error response tests.
- Add CI-ready test command.

Commands planned:

```bash
npm install -D jest supertest
npm test
```

## Stage 4: API Documentation

TODO:

- Add Swagger/OpenAPI package.
- Add `/api/docs`.
- Document auth APIs.
- Document category APIs.
- Document expense APIs.
- Document common error response.
- Document auth header format.
- Add request/response examples.

Expected docs URL:

```text
GET /api/docs
```

## Stage 5: Docker

TODO:

- Add backend `Dockerfile`.
- Add `.dockerignore`.
- Add `docker-compose.yml`.
- Add local PostgreSQL service.
- Add backend service.
- Add environment variable examples.
- Add Docker commands to README.

Learning goals:

- Docker image.
- Docker container.
- Docker logs.
- Docker Compose.
- Local backend + Postgres setup.
- Difference between PM2 deployment and Docker deployment.

## Stage 6: Upload Module

TODO:

- Add `uploads` module.
- Add Multer.
- Validate file size.
- Validate file MIME/type.
- Store files locally first for learning.
- Add S3-compatible storage interface.
- Add receipt upload API.
- Add profile image upload API.
- Add private file access pattern.
- Later add S3 pre-signed URLs.

Expected module:

```text
src/modules/uploads/
```

## Stage 7: AWS Free-Tier Deployment

TODO:

- Create EC2 instance.
- Configure SSH key pair.
- Configure security group.
- Install Node.js.
- Install Git.
- Install Nginx.
- Install PM2.
- Clone repo on EC2.
- Create backend `.env`.
- Run Prisma migrations on server.
- Run backend with PM2.
- Configure PM2 startup on reboot.

Interview topics:

- EC2.
- SSH.
- Security groups.
- IAM basics.
- Environment variables.
- Linux server setup.
- Process management.

## Stage 8: Nginx + SSL + PM2

TODO:

- Configure Nginx reverse proxy.
- Proxy `/api` to Express.
- Add correct proxy headers.
- Install Certbot.
- Add Let's Encrypt SSL.
- Add HTTP to HTTPS redirect.
- Test SSL renewal.
- Learn PM2 logs.
- Learn PM2 restart/reload.

Architecture:

```text
Client
  -> HTTPS
  -> Nginx with Let's Encrypt SSL
  -> Express app on localhost:3000
```

Interview topics:

- Why use Nginx before Express?
- What is SSL termination?
- Why Node can run HTTP internally while public traffic uses HTTPS?
- What is PM2?
- How to debug 502 Bad Gateway?

## Stage 9: CloudWatch + Logs

TODO:

- Understand EC2 metrics.
- Learn PM2 logs.
- Learn Nginx access logs.
- Learn Nginx error logs.
- Add production debugging checklist.
- Add basic CloudWatch concepts.
- Add CPU/disk/memory monitoring notes.

Interview topics:

- Logs vs metrics.
- Debugging production errors.
- CloudWatch basics.
- Health checks.
- Request IDs.

## Stage 10: CI/CD

TODO:

- Add GitHub Actions workflow.
- Run lint.
- Run tests.
- Run Prisma validate.
- Build Docker image if Docker is ready.
- Deploy to EC2 over SSH.
- Configure GitHub secrets.
- Add rollback notes.

Pipeline:

```text
Push to GitHub
  -> lint
  -> test
  -> prisma validate
  -> build
  -> deploy EC2
```

## Stage 11: AI Features

TODO:

- Add `ai` module.
- Add OpenAI service wrapper.
- Add expense categorization.
- Add monthly summary endpoint.
- Add spending insights endpoint.
- Add natural language finance query endpoint.
- Add AI timeout handling.
- Add AI fallback behavior.
- Add AI usage/cost tracking concept.
- Add privacy rules for financial data.

Example query:

```text
How much did I spend on food last month?
```

## AWS And Production Topics To Cover

The project should eventually cover:

- EC2.
- S3.
- Nginx.
- PM2.
- SSL/TLS.
- Let's Encrypt.
- Certbot.
- IAM users.
- IAM roles.
- IAM policies.
- Security groups.
- CloudWatch.
- PostgreSQL on EC2 or RDS Free Tier.
- Prisma migrations in production.
- Docker.
- Docker Compose.
- GitHub Actions.
- CI/CD.
- Environment variables.
- Server debugging.
- Logs and metrics.
- File uploads.
- Private S3 objects.
- Pre-signed URLs.
- JWT access tokens.
- Refresh token rotation.
- Zod validation.
- Central error handling.
- API versioning.
- OWASP API security basics.

## Best Next Action

Start with:

```text
Stage 2: Auth Security Upgrade
```

Reason:

- RefreshToken table already exists.
- Current auth only returns access tokens.
- Refresh token rotation is a high-value production and interview topic.
- It improves security before more modules are added.

After Stage 2:

```text
Stage 3: Jest + Supertest tests
Stage 4: Swagger docs
Stage 5: Docker
```
