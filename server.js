const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const roomRoutes = require('./routes/room');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/room', roomRoutes);

// Server & Socket Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('joinRoom', ({ roomCode, username }) => {
    socket.join(roomCode);
    io.to(roomCode).emit('userJoined', { user: username });
  });

  socket.on('sendChat', ({ roomCode, message, username }) => {
    io.to(roomCode).emit('receiveChat', { user: username, message });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
