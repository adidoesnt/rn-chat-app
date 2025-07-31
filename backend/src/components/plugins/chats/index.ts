import { Elysia } from 'elysia';
import { createChat } from './createChat';

export const chatRouter = new Elysia({ prefix: '/chats' }).use(createChat);
