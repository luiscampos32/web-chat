import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ExplorePage from './components/ExplorePage';
import ChatRoom from './components/ChatRoom';

export default function App() {
  const [username, setUsername] = useState('');

  if (!username) {
    return <LandingPage setUsername={setUsername} />;
  }

  return (
    <Router>
      <div className="app-shell">
        <header className="topbar glass-panel">
          <div>
            Chatting as <strong>@{username}</strong>
          </div>
          <button className="ghost-btn" onClick={() => setUsername('')}>
            Change name
          </button>
        </header>

        <main className="page-wrap page-enter">
          <Routes>
            <Route path="/" element={<Navigate to="/explore" />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/chat/:roomSlug" element={<ChatRoom username={username} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
