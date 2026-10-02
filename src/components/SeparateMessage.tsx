import type { Message } from '../types/chat';

type MessageBubbleProps = {
  message: Message;
};

function SeparateMessage({ message }: MessageBubbleProps) {
  const className = message.isOutgoing
    ? 'message message--out'
    : 'message message--in';

  return (
    <div className={className}>
      <p className="message__text">{message.text}</p>
      <time className="message__time">{message.time}</time>
    </div>
  );
}

export default SeparateMessage;
