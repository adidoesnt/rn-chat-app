import { prisma } from 'components/prisma';
import { Elysia } from 'elysia';

export const getMessagesForChat = new Elysia().get(
  '/:id/messages',
  async ({ params, set }) => {
    try {
      const { id: chatId } = params;
      console.log(`Received request to fetch messages for chatId: ${chatId}`);

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

      console.log(
        `Fetched ${messages.length} messages for chatId: ${chatId}`
      );

      return {
        message: 'Messages fetched successfully',
        messages,
      };
    } catch (error) {
      console.error('Internal server error during message fetch:', error);
      set.status = 500;
      return {
        error: 'Internal server error',
      };
    }
  },
);
