import { prisma } from 'components/prisma';
import { Elysia, t } from 'elysia';

const createChatSchema = t.Object({
  userIds: t.Array(t.String(), {
    minLength: 2,
  }),
  name: t.String().optional(),
});

export const createChat = new Elysia().post(
  '/',
  async ({ body, set }) => {
    try {
      console.log('Received request body:', body);

      const { userIds, name } = body;
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
  },
  {
    body: createChatSchema,
  },
);
