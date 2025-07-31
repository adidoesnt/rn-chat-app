import { Elysia } from 'elysia';
import { z } from 'zod';
import { prisma } from 'components/prisma';

const signupSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
});

export const signup = new Elysia().post('/signup', async ({ body, set }) => {
  try {
    const validatedBody = signupSchema.safeParse(body);

    if (!validatedBody.success) {
      set.status = 400;
      return {
        error: validatedBody.error.message,
      };
    }

    const { email, username, password } = validatedBody.data;
    const hashedPassword = await Bun.password.hash(password);

    const { password: createdPassword, ...createdUser } =
      await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

    return {
      message: 'Signup successful',
      user: createdUser,
    };
  } catch (error) {
    set.status = 500;
    return {
      error: 'Internal server error',
    };
  }
});
