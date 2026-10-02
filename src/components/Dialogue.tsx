import { useEffect, useRef, useState } from 'react';
import { deleteNotification, getMessages, getNotification, sendMessage } from '../api/greenApi';
import type { FoundContact, Message } from '../types/chat';
import { formatTime, isAbortError, messageFromNotification, messagesFromHistory } from '../utils/chat';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

type ChatWindowProps = {
  contact: FoundContact | null;
};

function Dialogue({ contact }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const historyRequest = useRef(0);

  useEffect(() => {
    if (!contact) {
      return;
    }

    const request = historyRequest.current + 1;
    historyRequest.current = request;
    const activeChatId = contact.chatId;
    setMessages([]);
    setError('');

    getMessages(activeChatId)
      .then((history) => {
        if (historyRequest.current !== request) {
          return;
        }

        const nextMessages = messagesFromHistory(history, activeChatId);
        setMessages((current) => {
          const ids = new Set(nextMessages.map((item) => item.id));
          const live = current.filter((item) => item.chatId === activeChatId && !ids.has(item.id));
          return [...nextMessages, ...live];
        });
      })
      .catch((historyError: unknown) => {
        if (historyRequest.current !== request) {
          return;
        }

        setError(historyError instanceof Error ? historyError.message : 'Не удалось загрузить историю');
      });
  }, [contact]);

  useEffect(() => {
    if (!contact) {
      return;
    }

    const controller = new AbortController();
    const activeChatId = contact.chatId;

    async function poll() {
      while (!controller.signal.aborted) {
        try {
          const notification = await getNotification(controller.signal);
          if (controller.signal.aborted || !notification?.receiptId) {
            continue;
          }

          const message = messageFromNotification(notification, activeChatId);
          if (message) {
            setMessages((current) => {
              if (current.some((item) => item.id === message.id)) {
                return current;
              }

              return [...current, message];
            });
          }

          await deleteNotification(notification.receiptId);
        } catch (pollError) {
          if (isAbortError(pollError) || controller.signal.aborted) {
            return;
          }

          await new Promise((resolve) => {
            window.setTimeout(resolve, 1000);
          });
        }
      }
    }

    void poll();

    return () => controller.abort();
  }, [contact]);

  async function handleSend(text: string) {
    if (!contact) {
      return;
    }

    const activeChatId = contact.chatId;

    try {
      const idMessage = await sendMessage(activeChatId, text);
      setError('');
      setMessages((current) => {
        if (current.some((item) => item.id === idMessage)) {
          return current;
        }

        return [
          ...current,
          {
            id: idMessage,
            chatId: activeChatId,
            text,
            time: formatTime(Math.floor(Date.now() / 1000)),
            isOutgoing: true,
          },
        ];
      });
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Не удалось отправить сообщение');
      throw sendError;
    }
  }

  return (
    <section className="chat-window">
      <header className="chat-window__header">
        {contact ? <h2 className="chat-window__title">{contact.title}</h2> : null}
      </header>
      {contact ? <MessageList messages={messages} /> : <div className="chat-window__empty" />}
      {contact ? (
        <>
          {error ? <p className="chat-window__error">{error}</p> : null}
          <MessageInput sendMessage={handleSend} />
        </>
      ) : null}
    </section>
  );
}

export default Dialogue;
