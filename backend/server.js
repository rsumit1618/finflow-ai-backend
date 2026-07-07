import app from "./src/app.js";
import { env } from "./src/config/env.js";
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// ✅ Sentry initialize
Sentry.init({
  dsn: env.SENTRY_DSN || process.env.SENTRY_DSN,
  environment: env.NODE_ENV || 'development',
  tracesSampleRate: 0.1,
  integrations: [nodeProfilingIntegration()],
});

console.log('✅ Sentry initialized');

app.listen(env.port, "0.0.0.0", () => {
  console.log(
    `FinFlow AI server running on http://0.0.0.0:${env.port} in ${env.nodeEnv} mode`
  );
});
