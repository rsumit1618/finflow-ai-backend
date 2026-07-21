# 🚀 FinFlow AI Backend

> Production-ready Node.js backend with AWS EC2, PostgreSQL, Redis, Nginx, PM2, Sentry, S3, Prisma, Swagger & GitHub Actions CI/CD

---

## 📌 Project Overview

FinFlow AI is a full-stack application. This repository contains the **backend API** built with Node.js + Express, deployed on AWS EC2 with production-grade tools and practices.

### Key Features

- ✅ JWT Authentication (Access + Refresh Tokens)
- ✅ Distributed Rate Limiting (Redis)
- ✅ File Upload to S3 (PDFs, Images)
- ✅ **Video Upload** — MP4, MKV, WebM, AVI, MOV, WMV, FLV, etc. (max 5 files / 500MB)
- ✅ **Thumbnail Support** — Optional thumbnail images for videos
- ✅ Error Tracking with Sentry
- ✅ API Documentation with Swagger
- ✅ CI/CD with GitHub Actions
- ✅ PM2 Cluster Mode (2+ instances)
- ✅ Nginx Reverse Proxy
- ✅ PostgreSQL + Prisma ORM
- ✅ Request Logging & Security Headers

---

## 📁 Project Structure

```text
finflow-ai-backend/
├── .github/workflows/
│   └── deploy-backend.yml     # GitHub Actions CI/CD
├── prisma/
│   ├── schema.prisma           # Database schema (User, Profile, RefreshToken, Video, Qualification)
│   └── migrations/             # Migration files
├── src/
│   ├── config/
│   │   ├── env.js              # Environment variables
│   │   ├── prisma.js           # Prisma client
│   │   ├── redis.js            # Redis connection
│   │   ├── s3.js               # AWS S3 client
│   │   ├── sentry.js           # Sentry config
│   │   └── swagger.js          # Swagger/OpenAPI config
│   ├── constants/
│   │   └── appConstants.js     # App constants (API_VERSION, etc.)
│   ├── middlewares/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── errorMiddleware.js   # Global error handler (Zod, Prisma, AppError)
│   │   ├── loggerMiddleware.js  # Request logging
│   │   ├── rateLimitMiddleware.js# In-memory rate limiter (for auth routes)
│   │   ├── requestIdMiddleware.js# Request ID generator
│   │   ├── securityMiddleware.js # CORS, security headers
│   │   └── validate.js          # Zod validation middleware
│   ├── modules/
│   │   ├── auth/               # Authentication + Profile management
│   │   │   ├── controllers/    # Thin — delegates to service
│   │   │   ├── routes/         # Route definitions + Swagger docs
│   │   │   ├── services/       # Business logic (register, login, profile, etc.)
│   │   │   └── validators/     # Zod schemas
│   │   ├── health/             # Health check endpoint
│   │   │   └── routes/
│   │   └── upload/             # File upload — PDF, images, videos
│   │       ├── controllers/    # Thin — delegates to service
│   │       ├── routes/         # Routes + multer config + Swagger docs
│   │       ├── services/       # *** NEW *** Business logic for uploads
│   │       └── validators/     # MIME types, extensions, file helpers
│   ├── repositories/           # Data access layer (Prisma queries)
│   │   ├── userRepository.js   # Users + Profiles + Qualifications
│   │   ├── refreshTokenRepository.js
│   │   └── videoRepository.js  # *** NEW *** Video CRUD
│   ├── services/               # Shared services
│   │   └── s3Service.js        # S3 upload, delete, presigned URLs
│   └── utils/
│       ├── AppError.js         # Custom error class
│       └── apiResponse.js      # Success response helper
├── .env                         # Environment variables (not in Git)
├── ecosystem.config.cjs         # PM2 configuration
├── server.js                    # Entry point
├── package.json
└── README.md
```

---

## 🛠️ Local Setup

### Prerequisites

| Tool | Version | Installation |
|------|---------|--------------|
| Node.js | v18+ | [Download](https://nodejs.org/) |
| PostgreSQL | 17+ | [Download](https://www.postgresql.org/download/) |
| Redis | 7+ | [Download](https://redis.io/download/) |
| npm | 10+ | Comes with Node.js |

---

### Step 1: Clone Repository

```bash
git clone https://github.com/rsumit1618/finflow-ai-backend.git
cd finflow-ai-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

**Required Variables:**

```env
NODE_ENV=development
PORT=3000

DATABASE_URL="postgresql://postgres:your_password@localhost:5432/finflow_ai"

JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET="your_refresh_secret"
JWT_REFRESH_EXPIRES_IN=30d

SENTRY_DSN="your_sentry_dsn"

CORS_ORIGIN=http://localhost:3000

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=finflow-assets
```

### Step 4: Setup Database

**PostgreSQL:**

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE finflow_ai;

# Create user
CREATE USER finflow_user WITH PASSWORD 'sumit0074';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE finflow_ai TO finflow_user;

# Exit
\q
```

**Prisma Migrations:**

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate dev

# Or push directly (if migration issues)
npx prisma db push
```

### Step 5: Start Redis (Local)

**Windows (WSL):**

```bash
wsl -d Ubuntu
sudo service redis-server start
redis-cli ping  # Expected: PONG
```

**Linux/Mac:**

```bash
sudo systemctl start redis
redis-cli ping  # Expected: PONG
```

### Step 6: Start Backend

```bash
node server.js
```

**Expected Output:**

```text
✅ Redis connected
✅ Sentry initialized
FinFlow AI server running on http://0.0.0.0:3000 in development mode
```

### Step 7: Verify API

```bash
# Health check
curl http://localhost:3000/api/health

# Swagger UI
open http://localhost:3000/api-docs
```

---

## 🔧 Local Development Challenges & Fixes

### ❌ Challenge 1: Redis Not Found
**Error:** `⚠️ Redis not found. Rate limiting will use MemoryStore.`

**Fix:**
```bash
# Start Redis (WSL)
sudo service redis-server start
redis-cli ping  # Should return PONG

# Check Redis password in .env
REDIS_PASSWORD=your_password
```

### ❌ Challenge 2: Prisma Shadow Database Error
**Error:** `P3014: Permission denied to create database`

**Fix:**
```bash
# Use db push instead of migrate dev
npx prisma db push

# Or resolve failed migration
npx prisma migrate resolve --applied migration_name
```

### ❌ Challenge 3: JWT_SECRET Missing
**Error:** `Missing required environment variable: JWT_SECRET`

**Fix:**
```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy output to .env
JWT_SECRET=generated_secret_here
```

---

## 🚀 Production Deployment (AWS EC2)

### Step 1: Login to EC2
```bash
ssh -i finflow-ai-key.pem ubuntu@56.228.4.142
```

### Step 2: Install Dependencies
```bash
sudo apt update
sudo apt install nodejs npm git nginx redis-server postgresql -y

# Install PM2 globally
sudo npm install -g pm2

# Install AWS CLI
sudo apt install awscli -y
```

### Step 3: Clone & Setup
```bash
git clone https://github.com/rsumit1618/finflow-ai-backend.git
cd finflow-ai-backend
npm install
cp .env.example .env
nano .env  # Add production values
```

### Step 4: Start with PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Step 5: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/finflow
```

**Config:**

```nginx
upstream finflow_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name 56.228.4.142;

    location / {
        proxy_pass http://finflow_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/finflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: CI/CD (GitHub Actions)
Workflow file: `.github/workflows/deploy-backend.yml`

```yaml
name: Deploy Backend to EC2

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/finflow-ai-backend
            git pull origin main
            npm install
            pm2 restart finflow-backend
```

---

## 🗄️ Database Management

**Migration Commands**
```bash
# Apply pending migrations
npx prisma migrate deploy

# Resolve failed migration
npx prisma migrate resolve --applied migration_name

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

**SQL Queries**
```sql
-- Check tables
\dt

-- View users
SELECT * FROM users;

-- View videos
SELECT * FROM videos;
```

---

## 📊 Monitoring

**PM2 Logs**
```bash
# View logs
pm2 logs finflow-backend --lines 50

# Monitor
pm2 monit

# Clear logs
pm2 flush
```

**Redis Monitoring**
```bash
# Check Redis keys
redis-cli KEYS "*"

# Check rate limit data
redis-cli GET "rl:127.0.0.1"

# Monitor Redis
redis-cli MONITOR
```

---

## 🔒 Security Checklist

| Security Measure | Status |
|------------------|--------|
| JWT Authentication | ✅ Done |
| Refresh Token Rotation | ✅ Done |
| Rate Limiting (Redis) | ✅ Done |
| CORS Configuration | ✅ Done |
| Security Headers | ✅ Done |
| Environment Variables (not in Git) | ✅ Done |
| HTTPS/SSL | ⬜ Pending |
| Secrets Manager | ⬜ Pending |

---

## 🧪 API Endpoints

### Authentication & Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| POST | `/api/auth/refresh-token` | ❌ | Refresh access token |
| POST | `/api/auth/logout` | ❌ | Logout (revoke refresh token) |
| POST | `/api/auth/logout-all` | ✅ | Logout from all sessions |
| POST | `/api/auth/change-password` | ✅ | Change user password |
| **GET** | **`/api/auth/profile`** | **✅** | **Get user profile (firstName, lastName, age, college, etc.)** |
| **PUT** | **`/api/auth/profile`** | **✅** | **Update user profile fields** |
| GET | `/api/auth/qualifications` | ❌ | Get list of qualifications |
| GET | `/api/health` | ❌ | Health check |

### Video Upload

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **POST** | **`/api/upload/videos`** | **✅** | **Upload 1–5 video files (max 500MB total). Formats: MP4, MKV, WebM, AVI, MOV, WMV, FLV, OGV, 3GP, MPEG** |
| **GET** | **`/api/upload/videos`** | **✅** | **List all user videos, paginated (10/page), sorted by newest first** |
| **GET** | **`/api/upload/videos/:id`** | **✅** | **Get single video with presigned play URL + thumbnail URL** |
| **DELETE** | **`/api/upload/videos/:id`** | **✅** | **Delete video (removes from S3 + soft delete)** |
| **POST** | **`/api/upload/videos/:id/thumbnail`** | **✅** | **Upload thumbnail image (JPEG/PNG/WebP) for a video** |

### API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api-docs` | Swagger UI — interactive API documentation |

---

## 📦 Frontend Integration Examples

### Upload Videos

```javascript
const formData = new FormData();
formData.append('videos', videoFile1);  // *.mp4, *.mkv, *.webm, etc.
formData.append('videos', videoFile2);  // up to 5 files

const res = await fetch('/api/upload/videos', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});

const data = await res.json();
// data.data.videos = [{ id, fileName, fileSize, format, url, createdAt }]
```

### Fetch Videos

```javascript
const res = await fetch('/api/upload/videos?page=1&limit=10', {
  headers: { Authorization: `Bearer ${token}` },
});

const data = await res.json();
// data.data.videos = [{ id, fileName, url, thumbnailUrl, ... }]
// data.data.pagination = { total, page, limit, totalPages }
```

### Upload Thumbnail

```javascript
const thumbData = new FormData();
thumbData.append('thumbnail', imageFile);  // JPEG/PNG/WebP

const res = await fetch(`/api/upload/videos/${videoId}/thumbnail`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: thumbData,
});
```

---

## 📝 License
MIT © FinFlow AI

Built with ❤️ by Sumit | July 2026
