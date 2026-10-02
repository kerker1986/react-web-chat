import { useState } from 'react';
import './App.scss';
import ChatWindow from '@components/ChatWindow.tsx';
import Login from './components/Login';
import { loadCredentials } from './storage/credentials';

function App() {
  const [authorized, setAuthorized] = useState(() => loadCredentials() !== null);

  return (
    <div className={authorized ? 'app app--chat' : 'app'}>
      {authorized ? <ChatWindow /> : <Login onSuccess={() => setAuthorized(true)} />}
    </div>
  );
}

export default App;
