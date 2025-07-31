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
    console.log('Received request body:', body);

    const validatedBody = createChatSchema.safeParse(body);

    if (!validatedBody.success) {
      set.status = 400;
      console.warn('Validation failed:', validatedBody.error.message);
      return {
        error: validatedBody.error.message,
      };
    }

    const { userIds, name } = validatedBody.data;
    const isGroupChat = userIds.length > 2;
    if (!isGroupChat && name) {
      console.warn('Chat name is not allowed for non-group chats');
    }

    console.log('Checking for existing chat with userIds:', userIds);

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
      console.warn('Chat already exists:', existingChat);
      return {
        message: 'Chat already exists',
        chat: existingChat,
      };
    }

    console.log('Creating new chat with data:', {
      name: isGroupChat ? (name ?? 'New Group Chat') : null,
      userIds,
    });

    const chat = await prisma.chat.create({
      data: {
        name: isGroupChat ? (name ?? 'New Group Chat') : null,
        users: {
          connect: userIds.map((userId) => ({ id: userId })),
        },
      },
    });
    
    console.log('Chat created successfully:', chat);

    return {
      message: 'Chat created successfully',
      chat,
    };
  } catch (error) {
    set.status = 500;
    console.error('Internal server error:', error);
    return {
      error: 'Internal server error',
    };
  }
});
