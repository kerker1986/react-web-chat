export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isActive?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  text: string;
  time: string;
  isOutgoing: boolean;
}

export interface FoundContact {
  chatId: string;
  title: string;
}
