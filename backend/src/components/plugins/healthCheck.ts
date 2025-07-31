import { Elysia } from 'elysia';

const handler = () => 'OK';

export const healthCheck = new Elysia()
  .get('/', handler)
  .get('/health', handler);
