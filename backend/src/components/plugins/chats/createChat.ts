import { prisma } from 'components/prisma';
import { Elysia } from 'elysia';
import { z } from 'zod';

const createChatSchema = z.object({
  userIds: z.array(z.string()).refine((users) => users.length > 1, {
    message: 'At least 2 users are required to create a chat',
  }),
  name: z.string().optional(),
});

export const createChat = new Elysia().post('/', async ({ body, set }) => {
  try {
    const validatedBody = createChatSchema.safeParse(body);

    if (!validatedBody.success) {
      set.status = 400;
      return {
        error: validatedBody.error.message,
      };
    }

    const { userIds, name } = validatedBody.data;
    const isGroupChat = userIds.length > 2;
    if (!isGroupChat && name) {
      console.warn('Chat name is not allowed for group chats');
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            users: {
              every: { id: { in: userIds } },
            },
          },
          {
            users: {
              none: { id: { notIn: userIds } },
            },
          },
        ],
      },
    });

    if (existingChat) {
      console.warn('Chat already exists', existingChat);
      return {
        message: 'Chat already exists',
        chat: existingChat,
      };
    }

    const chat = await prisma.chat.create({
      data: {
        name: isGroupChat ? (name ?? 'New Group Chat') : null,
        users: {
          connect: userIds.map((userId) => ({ id: userId })),
        },
      },
    });

    return {
      message: 'Chat created successfully',
      chat,
    };
  } catch (error) {
    set.status = 500;
    return {
      error: 'Internal server error',
    };
  }
});
