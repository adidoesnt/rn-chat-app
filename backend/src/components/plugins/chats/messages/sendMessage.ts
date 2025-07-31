import { prisma } from 'components/prisma';
import { Elysia } from 'elysia';
import { z } from 'zod';

const sendMessageSchema = z.object({
  senderId: z.string(),
  content: z.string(),
});

export const sendMessage = new Elysia().ws('/:chatId/messages', {
  message: async (ws, message) => {
    try {
      const { chatId } = ws.data.params;

      const validatedMessage = sendMessageSchema.safeParse(message);

      if (!validatedMessage.success) {
        ws.send(
          JSON.stringify({
            error: 'Invalid message',
          }),
        );
        return;
      }

      const { senderId, content } = validatedMessage.data;
      const savedMessage = await prisma.message.create({
        data: {
          content,
          senderId,
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

      ws.publish(chatId, savedMessage);
    } catch (error) {
      console.error(error);
      ws.send(
        JSON.stringify({
          error: 'Internal server error',
        }),
      );
    }
  },
});
