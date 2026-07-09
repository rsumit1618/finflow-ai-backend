import express from "express";
import cors from "cors";
import rateLimit from 'express-rate-limit';
import authRoutes from "./modules/auth/routes/authRoutes.js";
import categoryRoutes from "./modules/category/routes/categoryRoutes.js";
import expenseRoutes from "./modules/expense/routes/expenseRoutes.js";
import healthRoutes from "./modules/health/routes/healthRoutes.js";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import { corsOptions, securityHeaders } from "./middlewares/securityMiddleware.js";
import { requestIdMiddleware } from "./middlewares/requestIdMiddleware.js";
import { API_VERSION } from "./constants/appConstants.js";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.js";
import Sentry from './config/sentry.js';


const app = express();

console.log('🔥 FORCE TEST: Rate limit loading...');

const limiter = rateLimit({
  windowMs: 10 * 1000,      // 10 seconds
  max: 2,                   // 2 requests per 10 seconds
  message: {
    success: false,
    message: "TEST RATE LIMIT HIT",
  },
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,

  // Make key stable behind proxies (first IP from x-forwarded-for)
  keyGenerator: (req) => {
    const xff = req.headers["x-forwarded-for"];
    const firstIp =
      typeof xff === "string" ? xff.split(",")[0].trim() : undefined;

    return firstIp || req.ip;
  },

  skip: (req) => {
    return req.headers["x-bypass-rate-limit"] === "true";
  },

});

// ✅ Apply limiter to all requests
app.use(limiter);

console.log('✅ FORCE TEST: Rate limit applied');

app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(requestIdMiddleware);
app.use(loggerMiddleware);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.send("FinFlow AI Backend is running");
});

app.get('/force-error', (_req, _res) => {
  throw new Error('Manual 500 error for Sentry test');
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);

app.use(`/api/${API_VERSION}/health`, healthRoutes);
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/categories`, categoryRoutes);
app.use(`/api/${API_VERSION}/expenses`, expenseRoutes);

// Register Sentry's Express error handler
Sentry.setupExpressErrorHandler(app);

app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;
