import { prisma } from 'components/prisma';
import { Elysia } from 'elysia';

export const getChatsForUser = new Elysia().get('/', async ({ query, set }) => {
  try {
    const { userId } = query;
    console.log('Received request to fetch chats for userId:', userId);

    if (!userId) {
      set.status = 400;
      console.warn('User ID is required but not provided in query.');
      return {
        error: 'User ID is required',
      };
    }

    console.log('Fetching chats for userId:', userId);
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

    console.log(`Fetched ${chats.length} chats for userId:`, userId);
    
    return {
      message: 'Chats fetched successfully',
      chats,
    };
  } catch (error) {
    set.status = 500;
    console.error('Internal server error during chat fetch:', error);
    return {
      error: 'Internal server error',
    };
  }
});
