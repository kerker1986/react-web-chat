import { useState } from 'react';
import type { FoundContact } from '../types/chat';
import Dialogue from './Dialogue.tsx';
import Sidebar from './Sidebar';

function ChatWindow() {
  const [selected, setSelected] = useState<FoundContact | null>(null);

  return (
    <div className="chat-screen">
      <Sidebar selectedChatId={selected?.chatId ?? ''} onSelect={setSelected} />
      <Dialogue contact={selected} />
    </div>
  );
}

export default ChatWindow;
