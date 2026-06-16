import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(loggerMiddleware);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FinFlow AI Backend is running");
});

app.use("/api", healthRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
