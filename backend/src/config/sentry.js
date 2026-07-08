import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { env } from './env.js';

export const initSentry = () => {
  Sentry.init({
    dsn: env.SENTRY_DSN || process.env.SENTRY_DSN,
    environment: env.NODE_ENV || 'development',
    tracesSampleRate: 0.1,
    integrations: [nodeProfilingIntegration()],
  });
  console.log('✅ Sentry initialized');
};

export default Sentry;