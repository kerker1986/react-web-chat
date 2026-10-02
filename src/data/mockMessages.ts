import type { Message } from '../types/chat';

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    chatId: 'chat-anna',
    text: 'Привет! Как продвигается проект?',
    time: '09:12',
    isOutgoing: false,
  },
  {
    id: 'msg-2',
    chatId: 'chat-anna',
    text: 'Привет! Почти закончил, осталось пара правок',
    time: '09:13',
    isOutgoing: true,
  },
  {
    id: 'msg-3',
    chatId: 'chat-anna',
    text: 'Отлично! Когда сможешь показать?',
    time: '09:14',
    isOutgoing: false,
  },
  {
    id: 'msg-4',
    chatId: 'chat-anna',
    text: 'Сегодня вечером пришлю ссылку на сборку. Там уже есть сайдбар и окно переписки.',
    time: '09:15',
    isOutgoing: true,
  },
];
