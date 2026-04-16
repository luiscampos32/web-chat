require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());

const server = http.createServer(app);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
});

const onlineUsers = {}; // { socketId: { username, roomSlug } }
const typingByRoom = {}; // { roomSlug: Set<username> }

const usersForRoom = (roomSlug) => Object.values(onlineUsers).filter((u) => u.roomSlug === roomSlug);
const emitUsers = (roomSlug) => io.to(roomSlug).emit('user_list', usersForRoom(roomSlug));
const emitTyping = (roomSlug) => {
  const usersTyping = typingByRoom[roomSlug] ? [...typingByRoom[roomSlug]] : [];
  io.to(roomSlug).emit('typing_update', usersTyping);
};

const removeTypingUser = (roomSlug, username) => {
  if (!roomSlug || !username || !typingByRoom[roomSlug]) {
    return;
  }

  typingByRoom[roomSlug].delete(username);

  if (typingByRoom[roomSlug].size === 0) {
    delete typingByRoom[roomSlug];
  }

  emitTyping(roomSlug);
};

io.on('connection', (socket) => {
  socket.on('join_room', async ({ roomSlug, username }) => {
    socket.join(roomSlug);
    onlineUsers[socket.id] = { username, roomSlug };

    const { data: history } = await supabase
      .from('messages')
      .select('*')
      .eq('room_slug', roomSlug)
      .order('created_at', { ascending: true });

    socket.emit('message_history', history || []);
    emitUsers(roomSlug);
    emitTyping(roomSlug);
  });

  socket.on('leave_room', ({ roomSlug }) => {
    const user = onlineUsers[socket.id];
    if (!user) {
      return;
    }

    const activeRoom = roomSlug || user.roomSlug;
    socket.leave(activeRoom);
    delete onlineUsers[socket.id];
    removeTypingUser(activeRoom, user.username);
    emitUsers(activeRoom);
  });

  socket.on('typing_start', ({ roomSlug, username }) => {
    if (!roomSlug || !username) {
      return;
    }

    if (!typingByRoom[roomSlug]) {
      typingByRoom[roomSlug] = new Set();
    }

    typingByRoom[roomSlug].add(username);
    emitTyping(roomSlug);
  });

  socket.on('typing_stop', ({ roomSlug, username }) => {
    removeTypingUser(roomSlug, username);
  });

  socket.on('send_message', async (data) => {
    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert([
        {
          room_slug: data.roomSlug,
          username: data.username,
          content: data.content,
        },
      ])
      .select();

    if (!error && newMessage) {
      io.to(data.roomSlug).emit('receive_message', newMessage[0]);
    }

    removeTypingUser(data.roomSlug, data.username);
  });

  socket.on('disconnect', () => {
    const user = onlineUsers[socket.id];
    if (!user) {
      return;
    }

    const room = user.roomSlug;
    delete onlineUsers[socket.id];
    removeTypingUser(room, user.username);
    emitUsers(room);
  });
});

server.listen(3001, () => console.log('🚀 Server running on port 3001'));
