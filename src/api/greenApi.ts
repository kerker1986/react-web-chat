import { loadCredentials } from '../storage/credentials';
import {
  errorMessage,
  readBody,
  type CheckAccountResult,
  type HistoryItem,
  type Notification,
} from '../types/httpResponse';

const API_METHOD = {
  authorization: 'getStateInstance',
  search: 'checkAccount',
  getMessages: 'getChatHistory',
  getNotification: 'receiveNotification',
  deleteNotification: 'deleteNotification',
  sendMessage: 'sendMessage',
} as const;

function instanceUrl(method: string, extra = ''): string {
  const credentials = loadCredentials();
  if (!credentials) {
    throw new Error('Нет данных для входа');
  }

  const hostId = credentials.idInstance.slice(0, 4);
  const id = encodeURIComponent(credentials.idInstance);
  const token = encodeURIComponent(credentials.apiTokenInstance);

  return `https://${hostId}.api.green-api.com/waInstance${id}/${method}/${token}${extra}`;
}

async function greenGet(url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });
  const data = await readBody(response);

  if (!response.ok) {
    throw new Error(errorMessage(data, response.status));
  }

  return data;
}

async function greenPost(url: string, body: unknown): Promise<unknown> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await readBody(response);

  if (!response.ok) {
    throw new Error(errorMessage(data, response.status));
  }

  return data;
}

async function greenDelete(url: string): Promise<void> {
  const response = await fetch(url, { method: 'DELETE' });

  if (!response.ok) {
    const data = await readBody(response);
    throw new Error(errorMessage(data, response.status));
  }
}

export async function authorization(): Promise<string> {
  const url = instanceUrl(API_METHOD.authorization);
  const data = await greenGet(url);

  if (!data || typeof data !== 'object' || !('stateInstance' in data) || typeof data.stateInstance !== 'string') {
    return '';
  }

  return data.stateInstance;
}

export async function search(
  query: { username: string } | { phoneNumber: number },
): Promise<CheckAccountResult> {
  const url = instanceUrl(API_METHOD.search);
  const data = await greenPost(url, query);

  if (!data || typeof data !== 'object') {
    return {};
  }

  return data as CheckAccountResult;
}

export async function getMessages(chatId: string): Promise<HistoryItem[]> {
  const url = instanceUrl(API_METHOD.getMessages);
  const data = await greenPost(url, { chatId, count: 100 });

  if (!Array.isArray(data)) {
    return [];
  }

  return data as HistoryItem[];
}

export async function sendMessage(chatId: string, message: string): Promise<string> {
  const url = instanceUrl(API_METHOD.sendMessage);
  const data = await greenPost(url, { chatId, message });

  if (!data || typeof data !== 'object' || !('idMessage' in data) || typeof data.idMessage !== 'string') {
    throw new Error('Не удалось отправить сообщение');
  }

  return data.idMessage;
}

export async function getNotification(signal: AbortSignal): Promise<Notification | null> {
  const url = instanceUrl(API_METHOD.getNotification, '?receiveTimeout=20');
  const data = await greenGet(url, signal);

  if (!data || typeof data !== 'object') {
    return null;
  }

  return data as Notification;
}

export async function deleteNotification(receiptId: number): Promise<void> {
  const url = instanceUrl(API_METHOD.deleteNotification, `/${receiptId}`);
  await greenDelete(url);
}
