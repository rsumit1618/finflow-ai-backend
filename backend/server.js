import app from "./src/app.js";
import { env } from "./src/config/env.js";
import rateLimit from 'express-rate-limit';  
// Rate limiter - 1 sec mein sirf 10 requests per IP
const limiter = rateLimit({
  windowMs: 1 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many requests, please try again after 1 second.'
  },
  statusCode: 429,
});

// App pe lagao
app.use(limiter);

app.listen(env.port, "0.0.0.0", () => {
  console.log(
    `FinFlow AI server running on http://0.0.0.0:${env.port} in ${env.nodeEnv} mode`
  );
});