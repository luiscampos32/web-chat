import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (type) => {
    const { error } = type === 'LOGIN' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    
    if (error) alert(error.message);
  };

  return (
    <div style={{ maxWidth: '300px', margin: '100px auto', textAlign: 'center' }}>
      <h2>DevChat</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
      <button onClick={() => handleAuth('LOGIN')}>Login</button>
      <button onClick={() => handleAuth('SIGNUP')} style={{ marginLeft: '10px' }}>Sign Up</button>
    </div>
  );
}