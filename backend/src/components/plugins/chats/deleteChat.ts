import { prisma } from 'components/prisma';
import { Elysia } from 'elysia';

export const deleteChat = new Elysia().delete(
  '/:id',
  async ({ params, set }) => {
    try {
      const { id } = params;

      const chat = await prisma.chat.delete({
        where: {
          id,
        },
      });

      if (!chat) {
        set.status = 404;
        return {
          error: 'Chat not found',
        };
      }

      return {
        message: 'Chat deleted successfully',
        chat,
      };
    } catch (error) {
      set.status = 500;
      return {
        error: 'Internal server error',
      };
    }
  },
);
