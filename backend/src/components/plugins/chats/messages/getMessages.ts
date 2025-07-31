import { prisma } from 'components/prisma';
import { Elysia } from 'elysia';

export const getMessagesForChat = new Elysia().get(
  '/:chatId/messages',
  async ({ params, set }) => {
    try {
      const { chatId } = params;

      const messages = await prisma.message.findMany({
        where: {
          chatId,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      return {
        message: 'Messages fetched successfully',
        messages,
      };
    } catch (error) {
      console.error(error);
      set.status = 500;
      return {
        error: 'Internal server error',
      };
    }
  },
);
