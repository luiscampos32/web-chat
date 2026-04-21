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
    <section className="explore page-enter">
      <div className="explore__header">
        <p className="landing__eyebrow">Discover channels</p>
        <h1>Public Chatrooms</h1>
        <p>Pick a room and start discussing with whoever is online.</p>
      </div>

      <div className="room-grid">
        {rooms.map((room, index) => (
          <Link to={`/chat/${room.slug}`} className="ghost-room">
          <article key={room.id} className="room-card glass-panel" style={{ animationDelay: `${index * 80}ms` }}>
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <span>Join room →</span>
          </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
