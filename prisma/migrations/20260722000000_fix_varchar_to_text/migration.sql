-- Fix "value too long for column" error (P2000) on video uploads
-- The Prisma schema defines s3Key, s3Url, thumbnailKey, thumbnailUrl as Text
-- but the actual DB columns are VARCHAR(500) from the cleanup migration.
-- AWS S3 presigned URLs easily exceed 500 characters.

ALTER TABLE "public"."videos"
  ALTER COLUMN "s3Key" TYPE TEXT,
  ALTER COLUMN "s3Url" TYPE TEXT,
  ALTER COLUMN "thumbnailKey" TYPE TEXT,
  ALTER COLUMN "thumbnailUrl" TYPE TEXT;

