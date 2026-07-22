import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { MulterError } from "multer";
import * as Sentry from "@sentry/node";
import { env } from "../config/env.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

export const globalErrorHandler = async (err, req, res, _next) => {
  console.error(err);

  let statusCode = 500;
  let message = "Internal Server Error";
  let details;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    details = err.issues;
  } else if (err instanceof AppError || err.isOperational) {
    statusCode = err.statusCode || 500;
    message = err.message;
    details = err.details;
  } else if (err instanceof MulterError) {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File too large. Maximum file size is 500MB per video.";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files. Maximum 5 videos per upload.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = `Unexpected field: "${err.field}". Use the field name "videos" for uploads.`;
        break;
      case "LIMIT_FIELD_KEY":
        message = "Field name too long.";
        break;
      case "LIMIT_PART_COUNT":
        message = "Too many form parts.";
        break;
      default:
        message = err.message || "File upload error";
    }
    details = { code: err.code, field: err.field };
  } else if (err.code === "P2000") {
    statusCode = 400;
    message = "Value too long for database column";
    details = {
      model: err.meta?.modelName || "Unknown",
      column: err.meta?.column_name || "Unknown",
      hint: "This is often caused by an S3 presigned URL or video path exceeding the column length limit.",
    };
  } else if (err.code === "P2002") {
    statusCode = 409;
    message = "Duplicate record";
  } else if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  if (statusCode >= 500) {
    Sentry.captureException(err);
    try {
      await Sentry.flush(2000);
    } catch (e) {
      console.error("Failed to flush Sentry:", e);
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(statusCode >= 500 && env.nodeEnv !== "production"
      ? { error: err.message, stack: err.stack }
      : {}),
  });
};
