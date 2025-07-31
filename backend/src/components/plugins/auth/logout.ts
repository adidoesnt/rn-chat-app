import { Elysia } from 'elysia';

export const logout = new Elysia().post('/logout', async ({ body, set }) => {
  try {
    // TODO: Implement logout

    return {
      message: 'Logout successful',
    };
  } catch (error) {
    set.status = 500;
    return {
      error: 'Internal server error',
    };
  }
});
