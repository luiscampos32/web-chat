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
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

const onlineUsers = {}; // Stores { socketId: { username, roomSlug } }

io.on("connection", (socket) => {
  socket.on("join_room", async ({ roomSlug, username }) => {
    socket.join(roomSlug);
    onlineUsers[socket.id] = { username, roomSlug };

    // Fetch message history from Supabase
    const { data: history } = await supabase
      .from('messages')
      .select('*')
      .eq('room_slug', roomSlug)
      .order('created_at', { ascending: true });

    socket.emit("message_history", history);

    // Update the online user list for everyone in the room
    const usersInRoom = Object.values(onlineUsers).filter(u => u.roomSlug === roomSlug);
    io.to(roomSlug).emit("user_list", usersInRoom);
  });

  socket.on("send_message", async (data) => {
    // Save message to Supabase DB
    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert([{ 
        room_slug: data.roomSlug, 
        username: data.username, 
        content: data.content 
      }])
      .select();

    if (!error && newMessage) {
      io.to(data.roomSlug).emit("receive_message", newMessage[0]);
    }
  });

  socket.on("disconnect", () => {
    const user = onlineUsers[socket.id];
    if (user) {
      const room = user.roomSlug;
      delete onlineUsers[socket.id];
      const usersInRoom = Object.values(onlineUsers).filter(u => u.roomSlug === room);
      io.to(room).emit("user_list", usersInRoom);
    }
  });
});

server.listen(3001, () => console.log("🚀 Server running on port 3001"));