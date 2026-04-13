const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
//const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const { createClient } = require('@supabase/supabase-client');
const supabaseUrl = 'https://whrjepftvicljasjmwjq.supabase.co'
const supabaseKey = 'sb_publishable_7zGUsb7vnGMh6eQPLQr17w_HZfc5V8B'
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { 
    origin: 'http://localhost:5173', // Your Vite dev server URL
    methods: ['GET', 'POST'],
  },
});

// In-memory tracking for online users
const onlineUsers = {};

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Listen for a message from a client
  socket.on('send_message', (data) => {
    // Broadcast that message to everyone connected
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});


server.listen(3001, () => {
  console.log('Server running on port 3001');
});
