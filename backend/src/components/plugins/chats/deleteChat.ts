import { prisma } from 'components/prisma';
import { Elysia } from 'elysia';

export const deleteChatById = new Elysia().delete(
  '/:id',
  async ({ params, set }) => {
    try {
      const { id } = params;
      console.log(`Received request to delete chat with id: ${id}`);

      const chat = await prisma.chat.delete({
        where: {
          id,
        },
      });

      if (!chat) {
        console.warn(`Chat with id ${id} not found for deletion.`);
        set.status = 404;
        return {
          error: 'Chat not found',
        };
      }

      console.log(`Chat with id ${id} deleted successfully:`, chat);

      return {
        message: 'Chat deleted successfully',
        chat,
      };
    } catch (error) {
      set.status = 500;
      console.error('Internal server error during chat deletion:', error);
      return {
        error: 'Internal server error',
      };
    }
  },
);
