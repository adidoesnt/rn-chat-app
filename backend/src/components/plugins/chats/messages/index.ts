import { Elysia } from 'elysia';
import { getMessagesForChat } from './getMessages';
import { sendMessage } from './sendMessage';

export const messagesRouter = new Elysia()
  .use(getMessagesForChat)
  .use(sendMessage);
