import { useEffect, useRef } from 'react';
import type { Message } from '../types/chat';
import SeparateMessage from './SeparateMessage.tsx';

type MessageListProps = {
  messages: Message[];
};

function MessageList({ messages }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-list" ref={listRef}>
      {messages.map((message) => (
        <SeparateMessage key={message.id} message={message} />
      ))}
    </div>
  );
}

export default MessageList;
