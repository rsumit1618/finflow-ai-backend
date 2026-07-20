-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable: users
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(16) NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "refreshToken" VARCHAR(500),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'user',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastTokenGeneratedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable: refresh_tokens
CREATE TABLE "public"."refresh_tokens" (
    "id" SERIAL NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" VARCHAR(16) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable: profiles
CREATE TABLE "public"."profiles" (
    "userId" VARCHAR(16) NOT NULL,
    "firstName" VARCHAR(50),
    "lastName" VARCHAR(50),
    "age" INTEGER,
    "college" VARCHAR(200),
    "qualificationYear" INTEGER,
    "address" VARCHAR(500),
    "highestQualification" VARCHAR(100),
    "profileImage" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("userId")
);

-- CreateTable: qualifications
CREATE TABLE "public"."qualifications" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "isOther" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable: videos
CREATE TABLE "public"."videos" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(16) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "s3Key" VARCHAR(500) NOT NULL,
    "s3Url" VARCHAR(500) NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "duration" DOUBLE PRECISION,
    "resolution" VARCHAR(50),
    "format" VARCHAR(20),
    "thumbnailKey" VARCHAR(500),
    "thumbnailUrl" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "users_userId_key" ON "public"."users"("userId");
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");
CREATE INDEX "users_email_idx" ON "public"."users"("email");
CREATE INDEX "users_userId_idx" ON "public"."users"("userId");
CREATE INDEX "users_role_idx" ON "public"."users"("role");
CREATE INDEX "refresh_tokens_userId_idx" ON "public"."refresh_tokens"("userId");
CREATE INDEX "refresh_tokens_tokenHash_idx" ON "public"."refresh_tokens"("tokenHash");
CREATE UNIQUE INDEX "qualifications_name_key" ON "public"."qualifications"("name");
CREATE INDEX "videos_userId_idx" ON "public"."videos"("userId");

-- Foreign Keys
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed Qualifications
INSERT INTO "public"."qualifications" ("name", "isOther") VALUES
  ('High School (10th)', false),
  ('Higher Secondary (12th)', false),
  ('Diploma', false),
  ('Bachelor of Arts (BA)', false),
  ('Bachelor of Science (BSc)', false),
  ('Bachelor of Commerce (BCom)', false),
  ('Bachelor of Engineering (BE/BTech)', false),
  ('Bachelor of Business Administration (BBA)', false),
  ('Master of Arts (MA)', false),
  ('Master of Science (MSc)', false),
  ('Master of Commerce (MCom)', false),
  ('Master of Engineering (ME/MTech)', false),
  ('Master of Business Administration (MBA)', false),
  ('Doctor of Philosophy (PhD)', false),
  ('Medical Degree (MBBS)', false),
  ('Law Degree (LLB)', false),
  ('Other', true)
ON CONFLICT ("name") DO NOTHING;
