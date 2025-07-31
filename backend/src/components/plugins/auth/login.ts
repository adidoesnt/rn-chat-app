import { Elysia } from 'elysia';
import { z } from 'zod';
import { prisma } from 'components/prisma';

const loginSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(8),
});

export const login = new Elysia().post('/login', async ({ body, set }) => {
  try {
    const validatedBody = loginSchema.safeParse(body);

    if (!validatedBody.success) {
      set.status = 400;
      return {
        error: validatedBody.error.message,
      };
    }

    const { username, password } = validatedBody.data;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      set.status = 401;
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
      return {
        error: 'Invalid credentials',
      };
    }

    return {
      message: 'Login successful',
      user: userWithoutPassword,
    };
  } catch (error) {
    set.status = 500;
    return {
      error: 'Internal server error',
    };
  }
});
