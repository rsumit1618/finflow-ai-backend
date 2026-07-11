# FinFlow AI Backend - Deployment & Feature Summary

This document contains all the details of the recent updates and the steps required to deploy the project on your AWS server.

## 1. Major Features Added
- **S3 Upload Integration**: General file upload and specialized PDF upload.
- **Document Management**: Database tracking for all uploaded PDFs with category support (`GENERAL`, `EXPENSE`, `OFFICE_DOC`, etc.).
- **Security**: 
    - **S3 Presigned URLs**: Files are private; the backend generates temporary links valid for 1 hour.
    - **User Isolation**: Users can only see and delete their own documents.
- **Pagination**: Document fetching is now paginated (10 docs per page by default).
- **Swagger Documentation**: Automatic API docs available at `/api-docs`.

---

## 2. Server (AWS) Update Steps
Run these commands in order after pulling the latest code to your server:

```bash
# 1. Install new dependencies (Swagger, Multer, AWS SDK)
npm install

# 2. Apply Database Migrations (Adds the Document table)
npx prisma migrate deploy

# 3. Restart the application to apply changes
pm2 restart all
```

---

## 3. API Usage for Frontend (Flutter)
- **Swagger UI**: `http://your-server-ip:3000/api-docs`
- **Endpoints**:
    - `POST /api/v1/upload/pdf`: Upload PDF (Multipart form-data: `file`, `category`).
    - `GET /api/v1/upload/documents`: Fetch docs (Query params: `page`, `limit`, `category`).
    - `DELETE /api/v1/upload/documents/:id`: Delete a specific document.

---

## 4. Environment Configuration (.env)
Make sure your server's `.env` has these keys:
```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=eu-north-1
S3_BUCKET_NAME=your_bucket_name

# Other existing keys
DATABASE_URL=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
NODE_ENV=production
```

---

## 5. Important: Swagger Production URL
In `src/config/swagger.js`, update the production URL to your actual domain name once it is ready.

```javascript
// src/config/swagger.js
url: process.env.NODE_ENV === 'production' 
  ? `https://your-domain.com/api/v1` // <-- UPDATE THIS
  : `http://localhost:3000/api/v1`,
```
