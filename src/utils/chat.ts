import type { Message } from '../types/chat';
import type { HistoryItem, Notification } from '../types/httpResponse';

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function parseSearchQuery(raw: string): { username: string } | { phoneNumber: number } | null {
  const value = raw.trim();
  if (!value) {
    return null;
  }

  if (value.startsWith('@') || /[^\d+\s()-]/.test(value)) {
    return { username: value.startsWith('@') ? value : `@${value}` };
  }

  const phone = value.replace(/[\s()-]/g, '').replace(/^\+/, '');
  if (!/^\d+$/.test(phone)) {
    return null;
  }

  return { phoneNumber: Number(phone) };
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function messagesFromHistory(history: HistoryItem[], chatId: string): Message[] {
  return history
    .filter((item) => {
      if (item.typeMessage && item.typeMessage !== 'textMessage') {
        return false;
      }

      return typeof item.textMessage === 'string' && item.textMessage.length > 0;
    })
    .map((item, index) => ({
      id: item.idMessage || `${item.timestamp ?? index}`,
      chatId: item.chatId || chatId,
      text: item.textMessage ?? '',
      time: formatTime(item.timestamp ?? 0),
      isOutgoing: item.type === 'outgoing',
    }))
    .reverse();
}

export function messageFromNotification(notification: Notification, chatId: string): Message | null {
  const body = notification.body;
  const text = body?.messageData?.textMessageData?.textMessage;
  const messageChatId = body?.senderData?.chatId;

  if (!body?.idMessage || !text || messageChatId !== chatId) {
    return null;
  }

  if (body.messageData?.typeMessage && body.messageData.typeMessage !== 'textMessage') {
    return null;
  }

  return {
    id: body.idMessage,
    chatId,
    text,
    time: formatTime(body.timestamp ?? Math.floor(Date.now() / 1000)),
    isOutgoing: body.typeWebhook !== 'incomingMessageReceived',
  };
}
