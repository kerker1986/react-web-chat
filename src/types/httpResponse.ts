export type CheckAccountResult = {
  exist?: boolean;
  chatId?: string;
  username?: string;
  phoneNumber?: number;
  status?: boolean;
  reason?: string;
};

export type HistoryItem = {
  type?: string;
  idMessage?: string;
  timestamp?: number;
  typeMessage?: string;
  chatId?: string;
  textMessage?: string;
};

export type NotificationBody = {
  typeWebhook?: string;
  timestamp?: number;
  idMessage?: string;
  senderData?: {
    chatId?: string;
  };
  messageData?: {
    typeMessage?: string;
    textMessageData?: {
      textMessage?: string;
    };
  };
};

export type Notification = {
  receiptId?: number;
  body?: NotificationBody;
};

export function errorMessage(data: unknown, status: number): string {
  if (data && typeof data === 'object' && 'reason' in data && typeof data.reason === 'string') {
    return data.reason;
  }

  return `Ошибка запроса: ${status}`;
}

export async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
