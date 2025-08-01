import { Elysia, t } from 'elysia';
import { prisma } from 'components/prisma';

const signupSchema = t.Object({
  email: t.String({
    format: 'email',
  }),
  username: t.String({
    minLength: 3,
    maxLength: 30,
  }),
  password: t.String({
    minLength: 8,
    maxLength: 255,
  }),
});

export const signup = new Elysia().post(
  '/signup',
  async ({ body, set }) => {
    try {
      console.log('Received signup request');

      const { email, username, password } = body;
      console.log(
        `Checking for existing user with email: ${email} or username: ${username}`,
      );

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        set.status = 400;
        console.warn(
          `Signup failed: user already exists with email "${email}" or username "${username}"`,
        );
        return {
          error: 'User already exists',
        };
      }

      console.log(
        `Creating new user with email: ${email}, username: ${username}`,
      );
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
  },
  {
    body: signupSchema,
  },
);
