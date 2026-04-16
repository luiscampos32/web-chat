import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ExplorePage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase.from('rooms').select('*');
      setRooms(data || []);
    };
    fetchRooms();
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1>Public Chatrooms</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {rooms.map(room => (
          <div key={room.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3>{room.name}</h3>
            <p style={{ color: '#666' }}>{room.description}</p>
            <Link to={`/chat/${room.slug}`} style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Join Room →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}