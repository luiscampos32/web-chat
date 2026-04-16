import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

export default function ChatRoom({ username }) {
  const { roomSlug } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.emit("join_room", { roomSlug, username });

    socket.on("message_history", (history) => setMessages(history));
    socket.on("receive_message", (msg) => setMessages(prev => [...prev, msg]));
    socket.on("user_list", (userList) => setUsers(userList));

    return () => {
      socket.off("message_history");
      socket.off("receive_message");
      socket.off("user_list");
    };
  }, [roomSlug, username]);

  const sendMsg = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("send_message", { roomSlug, username, content: message });
      setMessage("");
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 45px)' }}>
      <div style={{ width: '220px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
        <Link to="/explore" style={{ color: '#bdc3c7', textDecoration: 'none' }}>← Exit Room</Link>
        <h4 style={{ marginTop: '20px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>Online Users</h4>
        {users.map((u, i) => (
          <div key={i} style={{ padding: '5px 0', fontSize: '0.9rem' }}>
            <span style={{ color: '#2ecc71' }}>●</span> {u.username}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#007bff' }}>{m.username}</strong> <small style={{ color: '#999' }}>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
              <div style={{ marginTop: '3px' }}>{m.content}</div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMsg} style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
          <input 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder={`Message #${roomSlug}`} 
            style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <button type="submit" style={{ padding: '0 25px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}