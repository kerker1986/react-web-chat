import type { Chat } from '../types/chat';

export const mockChats: Chat[] = [
  {
    id: 'chat-anna',
    title: 'Анна Смирнова',
    lastMessage: 'Почти закончил, осталось пара правок',
    time: '09:13',
    isActive: true,
  },
  {
    id: 'chat-work',
    title: 'Рабочий чат',
    lastMessage: 'Спасибо за напоминание, буду вовремя!',
    time: '09:21',
    unreadCount: 2,
  },
  {
    id: 'chat-dmitry',
    title: 'Дмитрий Козлов',
    lastMessage: 'Ещё нет, но очень хочу посмотреть',
    time: '11:06',
  },
  {
    id: 'chat-family',
    title: 'Семья',
    lastMessage: 'Приготовлю что-нибудь вкусное',
    time: '11:32',
    unreadCount: 1,
  },
  {
    id: 'chat-olga',
    title: 'Ольга Белова',
    lastMessage: 'Сейчас скину в личку',
    time: '12:15',
  },
];
