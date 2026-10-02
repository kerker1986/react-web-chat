import { useState } from 'react';
import { search } from '../api/greenApi';
import type { FoundContact } from '../types/chat';
import { parseSearchQuery } from '../utils/chat';
import Button from './ui/Button';
import Input from './ui/Input';

type SidebarProps = {
  selectedChatId: string;
  onSelect: (contact: FoundContact) => void;
};

function Sidebar({ selectedChatId, onSelect }: SidebarProps) {
  const [query, setQuery] = useState('');
  const [contact, setContact] = useState<FoundContact | null>(null);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  async function handleSearch() {
    const parsed = parseSearchQuery(query);
    if (!parsed) {
      setError('Введите логин или номер телефона');
      return;
    }

    setSearching(true);
    setError('');

    try {
      const result = await search(parsed);

      if (result.exist && result.chatId) {
        const title = result.username || (result.phoneNumber ? String(result.phoneNumber) : result.chatId);
        setContact({ chatId: result.chatId, title });
        return;
      }

      setError(result.reason || 'Пользователь не найден');
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : 'Не удалось найти пользователя');
    } finally {
      setSearching(false);
    }
  }

  const selected = contact?.chatId === selectedChatId;

  return (
    <aside className="sidebar">
      <header className="sidebar__header">
        <h1 className="sidebar__title">Чаты</h1>
      </header>
      <div className="sidebar__search">
        <Input
          value={query}
          placeholder="Логин или телефон"
          inputHandler={setQuery}
        />
        <Button onClick={handleSearch} disabled={searching}>
          {searching ? '...' : 'Найти'}
        </Button>
      </div>
      {error ? <p className="sidebar__error">{error}</p> : null}
      {contact ? (
        <button
          className={selected ? 'chat-list-item chat-list-item--active' : 'chat-list-item'}
          type="button"
          onClick={() => onSelect(contact)}
        >
          <span className="chat-list-item__title">{contact.title}</span>
        </button>
      ) : null}
    </aside>
  );
}

export default Sidebar;
