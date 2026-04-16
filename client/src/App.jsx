import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ExplorePage from './components/ExplorePage';
import ChatRoom from './components/ChatRoom';

export default function App() {
  const [username, setUsername] = useState("");

  // If no username is set, only show the Landing Page
  if (!username) {
    return <LandingPage setUsername={setUsername} />;
  }

  return (
    <Router>
      <div style={{ padding: '10px', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <span>Chatting as: <strong>{username}</strong></span>
        <button onClick={() => setUsername("")} style={{ cursor: 'pointer' }}>Change Name</button>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/explore" />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/chat/:roomSlug" element={<ChatRoom username={username} />} />
      </Routes>
    </Router>
  );
}