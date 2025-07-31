import { Elysia, t } from 'elysia';
import { z } from 'zod';
import { prisma } from 'components/prisma';

const loginSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(8),
});

export const login = new Elysia().post('/login', async ({ body, set }) => {
  try {
    console.log('Received login request');

    const validatedBody = loginSchema.safeParse(body);

    if (!validatedBody.success) {
      set.status = 400;
      console.warn('Login request body validation failed', validatedBody.error.message);
      return {
        error: validatedBody.error.message,
      };
    }

    const { username, password } = validatedBody.data;
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
    const isPasswordValid = await Bun.password.verify(password, hashedPassword);

    if (!isPasswordValid) {
      // Best practice to use same error code and message as user not found
      set.status = 401;
      console.warn(`Login failed: invalid password for username "${username}"`);
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
});
