# AWS S3 Video Upload API Documentation

## Base URL

| Environment | URL |
|-------------|-----|
| **Development** | `http://localhost:3000/api/v1` |
| **Production** | `http://56.228.4.142:3000/api/v1` |

## Authentication

All upload endpoints require a **Bearer token** in the `Authorization` header.

```
Authorization: Bearer <access_token>
```

---

## Environment Variables (AWS Configuration)

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_REGION` | AWS region for S3 | `eu-north-1` (Stockholm) |
| `AWS_ACCESS_KEY_ID` | IAM access key ID | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | IAM secret access key | `...` |
| `S3_BUCKET_NAME` | S3 bucket name | `finflow-ai-uploads` |

### Required IAM Permissions

The IAM user/role needs the following S3 actions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::finflow-ai-uploads/*"
    }
  ]
}
```

---

## S3 Folder Structure

Files are organized in S3 with the following path pattern:

```
{bucket}/
├── {userId}/videos/
│   ├── {timestamp}-{originalname}      # Uploaded video files
│   └── ...
└── thumbnails/
    └── {userId}/
        └── {videoId}/
            └── {timestamp}-{originalname}   # Thumbnail images
```

---

## Response Format

All API responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Endpoints

---

### 1. Upload Videos

Upload 1–5 video files (max 500MB total).

**Endpoint:** `POST /upload/videos`

**Auth:** Bearer token required

**Content-Type:** `multipart/form-data`

**Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `videos` | File[] | Yes | Array of video files (1–5). Field name must be `videos` |

**Supported Formats:** `.mp4`, `.mkv`, `.webm`, `.avi`, `.mov`, `.wmv`, `.flv`, `.ogv`, `.3gp`, `.mpeg`, `.mpg`

**cURL Example:**
```bash
curl -X POST http://56.228.4.142:3000/api/v1/upload/videos \
  -H "Authorization: Bearer <access_token>" \
  -F "videos=@/path/to/video1.mp4" \
  -F "videos=@/path/to/video2.mp4"
```

**Postman:**
1. Method: `POST`
2. URL: `{{base_url}}/upload/videos`
3. Auth: Bearer Token
4. Body: `form-data`
   - Key: `videos` (type: File) — select your video
   - Add more `videos` keys for multiple files

**Response (201):**
```json
{
  "success": true,
  "message": "2 video(s) uploaded successfully",
  "data": {
    "videos": [
      {
        "id": 1,
        "fileName": "demo.mp4",
        "fileSize": 52428800,
        "format": "mp4",
        "mimeType": "video/mp4",
        "createdAt": "2026-07-13T12:00:00.000Z",
        "url": "https://s3.eu-north-1.amazonaws.com/finflow-ai-uploads/abc123/videos/1710230400000-demo.mp4?X-Amz-Algorithm=..."
      }
    ],
    "totalUploaded": 2
  }
}
```

---

### 2. List User Videos

Get paginated list of the authenticated user's videos (10 per page), sorted by newest first.

**Endpoint:** `GET /upload/videos`

**Auth:** Bearer token required

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | Page number |
| `limit` | integer | `10` | Items per page |

**cURL Example:**
```bash
curl -X GET "http://56.228.4.142:3000/api/v1/upload/videos?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

**Postman:**
1. Method: `GET`
2. URL: `{{base_url}}/upload/videos?page=1&limit=10`
3. Auth: Bearer Token

**Response (200):**
```json
{
  "success": true,
  "message": "Videos fetched successfully",
  "data": {
    "videos": [
      {
        "id": 1,
        "userId": "a1b2c3d4e5f6a7b8",
        "fileName": "demo.mp4",
        "fileSize": 52428800,
        "s3Key": "a1b2c3d4e5f6a7b8/videos/1710230400000-demo.mp4",
        "s3Url": "https://...",
        "mimeType": "video/mp4",
        "duration": null,
        "resolution": null,
        "format": "mp4",
        "thumbnailKey": null,
        "thumbnailUrl": null,
        "isActive": true,
        "createdAt": "2026-07-13T12:00:00.000Z",
        "updatedAt": "2026-07-13T12:00:00.000Z",
        "url": "https://s3...?X-Amz-Algorithm=...",
        "thumbnailUrl": null
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

> **Note:** `url` and `thumbnailUrl` in responses are **presigned URLs** valid for 1 hour. For long-term access, re-fetch the video details to get a fresh presigned URL.

---

### 3. Get Single Video

Get a single video by ID with fresh presigned URLs.

**Endpoint:** `GET /upload/videos/:id`

**Auth:** Bearer token required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Video ID |

**cURL Example:**
```bash
curl -X GET "http://56.228.4.142:3000/api/v1/upload/videos/1" \
  -H "Authorization: Bearer <access_token>"
```

**Postman:**
1. Method: `GET`
2. URL: `{{base_url}}/upload/videos/1`
3. Auth: Bearer Token

**Response (200):**
```json
{
  "success": true,
  "message": "Video fetched successfully",
  "data": {
    "id": 1,
    "userId": "a1b2c3d4e5f6a7b8",
    "fileName": "demo.mp4",
    "fileSize": 52428800,
    "s3Key": "...",
    "s3Url": "...",
    "mimeType": "video/mp4",
    "format": "mp4",
    "isActive": true,
    "createdAt": "2026-07-13T12:00:00.000Z",
    "url": "https://presigned-url...",
    "thumbnailUrl": null
  }
}
```

---

### 4. Delete Video

Soft-deletes the video (removes from S3 + marks inactive in DB).

**Endpoint:** `DELETE /upload/videos/:id`

**Auth:** Bearer token required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Video ID |

**cURL Example:**
```bash
curl -X DELETE "http://56.228.4.142:3000/api/v1/upload/videos/1" \
  -H "Authorization: Bearer <access_token>"
```

**Postman:**
1. Method: `DELETE`
2. URL: `{{base_url}}/upload/videos/1`
3. Auth: Bearer Token

**Response (200):**
```json
{
  "success": true,
  "message": "Video deleted successfully",
  "data": null
}
```

---

### 5. Upload Thumbnail

Upload a thumbnail image (JPEG/PNG/WebP) for a specific video.

**Endpoint:** `POST /upload/videos/:id/thumbnail`

**Auth:** Bearer token required

**Content-Type:** `multipart/form-data`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Video ID |

**Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `thumbnail` | File | Yes | Image file (JPEG, PNG, or WebP). Max 5MB. |

**cURL Example:**
```bash
curl -X POST "http://56.228.4.142:3000/api/v1/upload/videos/1/thumbnail" \
  -H "Authorization: Bearer <access_token>" \
  -F "thumbnail=@/path/to/thumbnail.jpg"
```

**Postman:**
1. Method: `POST`
2. URL: `{{base_url}}/upload/videos/1/thumbnail`
3. Auth: Bearer Token
4. Body: `form-data`
   - Key: `thumbnail` (type: File) — select your image

**Response (201):**
```json
{
  "success": true,
  "message": "Thumbnail uploaded successfully",
  "data": {
    "id": 1,
    "thumbnailKey": "thumbnails/a1b2c3d4e5f6a7b8/1/1710230400000-thumb.jpg",
    "thumbnailUrl": "https://s3...?X-Amz-Algorithm=..."
  }
}
```

---

## Presigned URL Mechanism

The API uses **AWS S3 presigned URLs** for secure video access. Key details:

| Aspect | Detail |
|--------|--------|
| **How it works** | Server generates a time-limited signed URL that grants access to a specific S3 object |
| **Expiration** | URLs expire **1 hour** after generation |
| **Video playback** | Presigned URLs work directly in `<video>` tags and media players |
| **Thumbnail display** | Presigned URLs work in `<img>` tags |
| **Refresh** | Re-fetch the video via `GET /upload/videos/:id` or `GET /upload/videos` to get new presigned URLs |

### Example: Video Playback in HTML

```html
<video controls width="640">
  <source src="{url_from_api_response}" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

### Example: Display Thumbnail

```html
<img src="{thumbnailUrl_from_api_response}" alt="Video thumbnail" />
```

---

## Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| `400` | `VALIDATION_ERROR` | Invalid file format, no files uploaded, or too many files |
| `401` | `UNAUTHORIZED` | Missing or invalid Bearer token |
| `404` | `NOT_FOUND` | Video not found or access denied |
| `413` | `FILE_TOO_LARGE` | File exceeds 500MB limit |
| `429` | `RATE_LIMITED` | Too many requests — 100 requests per 10 seconds |
| `500` | `SERVER_ERROR` | Internal server error (S3 failure, DB failure, etc.) |

---

## Rate Limiting

- **Global rate limit:** 100 requests per 10 seconds per IP
- **Auth endpoints:** 20 requests per 15 minutes per IP
- Rate limit headers are sent in responses: `RateLimit-*`
- Swagger docs (`/api-docs`) are excluded from rate limiting

---

## Swagger Documentation

Interactive API documentation is available at:

```
http://56.228.4.142:3000/api-docs
```

