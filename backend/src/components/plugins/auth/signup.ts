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
    console.log('Received signup request');
    const validatedBody = signupSchema.safeParse(body);

    if (!validatedBody.success) {
      set.status = 400;
      console.warn('Signup request body validation failed:', validatedBody.error.message);
      return {
        error: validatedBody.error.message,
      };
    }

    const { email, username, password } = validatedBody.data;
    console.log(`Checking for existing user with email: ${email} or username: ${username}`);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      set.status = 400;
      console.warn(`Signup failed: user already exists with email "${email}" or username "${username}"`);
      return {
        error: 'User already exists',
      };
    }

    console.log(`Creating new user with email: ${email}, username: ${username}`);
    const hashedPassword = await Bun.password.hash(password);
    const { password: createdPassword, ...createdUser } =
      await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

    console.log('Signup successful for user:', createdUser);

    return {
      message: 'Signup successful',
      user: createdUser,
    };
  } catch (error) {
    set.status = 500;
    console.error('Internal server error during signup:', error);
    return {
      error: 'Internal server error',
    };
  }
});
