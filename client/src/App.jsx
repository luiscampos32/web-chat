import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'

// Connect to the backend port
const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = () => {
    if (message !== "") {
      const messageData = {
        text: message, 
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', messageData);
      setMessage(''); // Clear input
    }
  };

  useEffect(() => {
    // Listen for messages from the server
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });

    // Cleanup: remove the listener when component unmounts
    return () => socket.off('receive_message');
  }, []);

  return (
    <>
      <section id="center">
        <div className="App">
          <h3>Live Chat</h3>
          <div className="chat-window">
            {messageList.map((msg, index) => (
              <p key={index}>{msg.text}<span>{msg.time}</span></p>
            ))}
          </div>
          <input
            type="text"
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;