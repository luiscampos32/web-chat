import { useState } from 'react';

export default function LandingPage({ setUsername }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setUsername(input);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' }}>
      <h1 className="anim-title">DevChat</h1>
      <p>Enter a display name to join the conversation.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input 
          type="text" 
          placeholder="e.g., CodeNinja" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Explore Chatrooms
        </button>
      </form>
    </div>
  );
}