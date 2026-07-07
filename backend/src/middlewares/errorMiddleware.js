import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import * as Sentry from "@sentry/node";

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
  });
};