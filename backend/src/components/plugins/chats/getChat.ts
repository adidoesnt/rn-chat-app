import { prisma } from 'components/prisma';
import { Elysia, t } from 'elysia';

const getChatByIdSchema = t.Object({
  id: t.String({
    format: 'uuid',
  }),
});

export const getChatById = new Elysia().get(
  '/:id',
  async ({ params, set }) => {
    try {
      const { id } = params;
      console.log(`Received request to fetch chat with id: ${id}`);

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
        console.warn(`Chat with id ${id} not found.`);
        set.status = 404;
        return {
          error: 'Chat not found',
        };
      }

      console.log(`Chat with id ${id} fetched successfully:`, chat);

      return {
        message: 'Chat fetched successfully',
        chat,
      };
    } catch (error) {
      set.status = 500;
      console.error('Internal server error during chat fetch:', error);
      return {
        error: 'Internal server error',
      };
    }
  },
  {
    params: getChatByIdSchema,
  },
);
