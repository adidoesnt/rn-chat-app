import { Elysia } from 'elysia';
import { createChat } from './createChat';
import { deleteChat } from './deleteChat';

export const chatRouter = new Elysia({ prefix: '/chats' })
  .use(createChat)
  .use(deleteChat);
