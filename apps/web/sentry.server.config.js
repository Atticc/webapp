// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const NODE_ENV = process.env.NODE_ENV || process.env.NEXT_PUBLIC_NODE_ENV;

Sentry.init({
  dsn: SENTRY_DSN || '',
  tracesSampleRate: NODE_ENV === 'development' ? 0.1 : 0.7,
});
