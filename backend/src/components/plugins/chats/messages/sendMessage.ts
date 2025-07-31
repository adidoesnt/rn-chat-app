import { prisma } from 'components/prisma';
import { Elysia } from 'elysia';
import { z } from 'zod';

const sendMessageSchema = z.object({
  senderId: z.string(),
  content: z.string(),
});

export const sendMessage = new Elysia().ws('/:id/messages', {
  message: async (ws, message) => {
    try {
      const { id: chatId } = ws.data.params;
      console.log('Received message for chatId:', chatId, message);

      const validatedMessage = sendMessageSchema.safeParse(message);

      if (!validatedMessage.success) {
        console.warn('Invalid message received for chatId:', chatId, validatedMessage.error);
        ws.send(
          JSON.stringify({
            error: 'Invalid message',
          }),
        );
        return;
      }

      const { senderId, content } = validatedMessage.data;
      console.log('Creating message in DB for chatId:', chatId, 'senderId:', senderId, 'content:', content);

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

      console.log('Message saved and publishing to chatId:', chatId, savedMessage);

      ws.publish(chatId, savedMessage);
    } catch (error) {
      console.error('Internal server error:', error);
      ws.send(
        JSON.stringify({
          error: 'Internal server error',
        }),
      );
    }
  },
});
