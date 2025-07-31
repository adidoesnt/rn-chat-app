import { signup } from './signup';
import { login } from './login';
import { logout } from './logout';
import { Elysia } from 'elysia';

export const authRouter = new Elysia({ prefix: '/auth' })
  .use(signup)
  .use(login)
  .use(logout);
