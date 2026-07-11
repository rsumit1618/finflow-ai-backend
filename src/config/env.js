import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  // S3 Configuration
  AWS_REGION: process.env.AWS_REGION || 'eu-north-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
};

const requiredEnvVars = [
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "DATABASE_URL",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "S3_BUCKET_NAME",
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}