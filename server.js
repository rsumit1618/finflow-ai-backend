import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { initSentry } from './src/config/sentry.js';

// ✅ Sentry initialize
initSentry();

app.listen(env.port, "0.0.0.0", () => {
  console.log(
    `FinFlow AI server running on http://0.0.0.0:${env.port} in ${env.nodeEnv} mode`
  );
});
