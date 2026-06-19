import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes/authRoutes.js";
import categoryRoutes from "./modules/category/routes/categoryRoutes.js";
import expenseRoutes from "./modules/expense/routes/expenseRoutes.js";
import healthRoutes from "./modules/health/routes/healthRoutes.js";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import { corsOptions, securityHeaders } from "./middlewares/securityMiddleware.js";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.js";

const app = express();

app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(loggerMiddleware);
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.send("FinFlow AI Backend is running");
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
