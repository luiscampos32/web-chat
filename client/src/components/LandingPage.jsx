import { useState } from 'react';

export default function LandingPage({ setUsername }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setUsername(input.trim());
    }
  };

  return (
    <section className="landing page-enter">
      <div className="landing__orb" aria-hidden="true" />
      <div className="landing__card glass-panel">
        <h1 className="landing__title">Dev Chat</h1>
        <p className="landing__subtitle">
          Choose a display name and jump in.
        </p>

        <form onSubmit={handleSubmit} className="landing__form">
          <input
            type="text"
            placeholder="e.g. CodeNinja"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button type="submit">Explore chatrooms</button>
        </form>
      </div>
    </section>
  );
}
