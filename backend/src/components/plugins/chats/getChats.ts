import { prisma } from 'components/prisma';
import { Elysia } from 'elysia';

export const getChatsForUser = new Elysia().get('/', async ({ query, set }) => {
  try {
    const { userId } = query;

    if (!userId) {
      set.status = 400;
      return {
        error: 'User ID is required',
      };
    }

    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return {
      message: 'Chats fetched successfully',
      chats,
    };
  } catch (error) {
    set.status = 500;
    return {
      error: 'Internal server error',
    };
  }
});
