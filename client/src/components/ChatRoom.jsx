import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

export default function ChatRoom({ username }) {
  const { roomSlug } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.emit('join_room', { roomSlug, username });

    socket.on('message_history', (history) => setMessages(history));
    socket.on('receive_message', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('user_list', (userList) => setUsers(userList));

    return () => {
      socket.off('message_history');
      socket.off('receive_message');
      socket.off('user_list');
    };
  }, [roomSlug, username]);

  const sendMsg = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', { roomSlug, username, content: message.trim() });
      setMessage('');
    }
  };

  const typingUsers = useMemo(
    () => (message.trim() ? [`${username} is typing`] : []),
    [message, username],
  );

  return (
    <section className="chat-layout page-enter">
      <aside className="chat-sidebar glass-panel">
        <Link to="/explore" className="chat-exit">← Exit room</Link>
        <h4>Online users</h4>
        <div className="user-list">
          {users.map((u, i) => (
            <div key={`${u.username}-${i}`} className="user-item">
              <span className="user-dot" />
              {u.username}
            </div>
          ))}
        </div>
      </aside>

      <div className="chat-main glass-panel">
        <header className="chat-header">
          <h2>#{roomSlug}</h2>
          <span>{users.length} online</span>
        </header>

        <div className="chat-messages">
          {messages.map((m, i) => {
            const mine = m.username === username;
            return (
              <article key={`${m.created_at ?? i}-${i}`} className={`bubble-row ${mine ? 'mine' : 'theirs'}`}>
                <div className={`bubble ${mine ? 'bubble--mine' : 'bubble--theirs'}`}>
                  <div className="bubble__meta">
                    <strong>{m.username}</strong>
                    <small>
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </small>
                  </div>
                  <p>{m.content}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="typing-wrap" aria-live="polite">
          {typingUsers.map((t) => (
            <div key={t} className="typing-pill">
              <span>{t}</span>
              <span className="typing-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={sendMsg} className="chat-form">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message #${roomSlug}`}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </section>
  );
}
