import { prisma } from 'components/prisma';
import { Elysia } from 'elysia';

export const getChatById = new Elysia().get('/:id', async ({ params, set }) => {
  try {
    const { id } = params;

    const chat = await prisma.chat.findUnique({
      where: {
        id,
      },
      include: {
        messages: {
          select: {
            content: true,
            createdAt: true,
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

    if (!chat) {
      set.status = 404;
      return {
        error: 'Chat not found',
      };
    }

    return {
      message: 'Chat fetched successfully',
      chat,
    };
  } catch (error) {
    set.status = 500;
    return {
      error: 'Internal server error',
    };
  }
});
