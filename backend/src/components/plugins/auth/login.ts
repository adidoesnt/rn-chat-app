import { Elysia, t } from 'elysia';
import { prisma } from 'components/prisma';

const loginSchema = t.Object({
  username: t.String({
    minLength: 3,
    maxLength: 30,
  }),
  password: t.String({
    minLength: 8,
    maxLength: 255,
  }),
});

export const login = new Elysia().post(
  '/login',
  async ({ body, set }) => {
    try {
      console.log('Received login request');

      const { username, password } = body;
      console.log(`Attempting login for username: ${username}`);

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        set.status = 401;
        console.warn(`Login failed: user not found for username "${username}"`);
        return {
          error: 'Invalid credentials',
        };
      }

      // user.password is a hashed password
      const { password: hashedPassword, ...userWithoutPassword } = user;
      const isPasswordValid = await Bun.password.verify(
        password,
        hashedPassword,
      );

      if (!isPasswordValid) {
        // Best practice to use same error code and message as user not found
        set.status = 401;
        console.warn(
          `Login failed: invalid password for username "${username}"`,
        );
        return {
          error: 'Invalid credentials',
        };
      }

      console.log(`Login successful for username: ${username}`);

      return {
        message: 'Login successful',
        user: userWithoutPassword,
      };
    } catch (error) {
      set.status = 500;
      console.error('Internal server error during login:', error);
      return {
        error: 'Internal server error',
      };
    }
  },
  {
    body: loginSchema,
  },
);
