import { Elysia } from 'elysia';
import { healthCheck, login, signup, logout } from 'components/plugins';

import { PORT } from './constants';

try {
  const app = new Elysia()
    .use(healthCheck)
    .use(login)
    .use(signup)
    .use(logout)
    .listen(PORT);

  const { hostname, port } = app.server ?? {};
  if (!hostname || !port) {
    throw new Error('Unable to start server');
  }

  console.log(`🦊 Elysia is running at ${hostname}:${port}`);
} catch (e) {
  const error = e as Error;
  console.error(error.message);

  process.exit(1);
}
