import app from "./src/app.js";
import { env } from "./src/config/env.js";
import rateLimit from 'express-rate-limit';

console.log('✅ Starting server with rate limit...');

// Rate limiter: 10 requests per second per IP
const limiter = rateLimit({
  windowMs: 1 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many requests, please try again after 1 second.'
  },
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter globally
app.use(limiter);

console.log('✅ Rate limiter applied');

app.listen(env.port, "0.0.0.0", () => {
  console.log(
    `FinFlow AI server running on http://0.0.0.0:${env.port} in ${env.nodeEnv} mode`
  );
});