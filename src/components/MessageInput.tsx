import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

type MessageInputProps = {
  sendMessage: (message: string) => Promise<void>;
};

function MessageInput({ sendMessage }: MessageInputProps) {
  const [messageBody, setMessageBody] = useState('');

  async function validateMessage() {
    const parsedMessage = messageBody.trim();
    if (!parsedMessage) {
      return;
    }

    try {
      await sendMessage(parsedMessage);
      setMessageBody('');
    } catch {
      // Текст ошибки показывает окно чата.
    }
  }

  return (
    <div className="message-input">
      <Input
        value={messageBody}
        inputHandler={setMessageBody}
        placeholder="Сообщение"
      />
      <Button onClick={validateMessage}>Отправить</Button>
    </div>
  );
}

export default MessageInput;
