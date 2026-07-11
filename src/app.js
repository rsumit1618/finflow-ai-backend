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
import RedisStore from 'rate-limit-redis';
import redisClient from './config/redis.js';
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.js";
import Sentry from './config/sentry.js';
import uploadRoutes from './modules/upload/routes/uploadRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

const app = express();

const limiter = rateLimit({
  // ✅ Fallback to MemoryStore if Redis is not connected
  store: redisClient.status === 'ready'
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
      })
    : undefined, // undefined means use default MemoryStore
  windowMs: 10 * 1000,
  max: 100, // Badha kar 100 kiya taaki assets load ho sakein
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"] || req.ip;
  },
  skip: (req) => {
    // Swagger routes ko rate limit se bahar rakhein
    return req.originalUrl.startsWith('/api-docs') || req.headers["x-bypass-rate-limit"] === "true";
  },
});

// ✅ Apply limiter to all requests
app.use(limiter);

app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(requestIdMiddleware);
app.use(loggerMiddleware);
app.use(express.json({ limit: "1mb" }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use('/api/upload', uploadRoutes);

app.use(`/api/${API_VERSION}/health`, healthRoutes);
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/categories`, categoryRoutes);
app.use(`/api/${API_VERSION}/expenses`, expenseRoutes);
app.use(`/api/${API_VERSION}/upload`, uploadRoutes);

// Register Sentry's Express error handler
Sentry.setupExpressErrorHandler(app);

app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;
