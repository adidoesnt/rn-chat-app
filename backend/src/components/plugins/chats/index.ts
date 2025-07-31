import { Elysia } from 'elysia';
import { createChat } from './createChat';
import { deleteChatById } from './deleteChat';
import { getChatById } from './getChat';
import { getChatsForUser } from './getChats';
import { messagesRouter } from './messages';

export const chatRouter = new Elysia({ prefix: '/chats' })
  .use(getChatsForUser)
  .use(getChatById)
  .use(createChat)
  .use(deleteChatById)
  .use(messagesRouter);
