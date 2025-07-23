// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

const users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('login', (username) => {
    users[socket.id] = username;
    io.emit('user-list', Object.values(users));
  });

  socket.on('private-message', ({ to, message, from }) => {
    const targetSocket = Object.keys(users).find(key => users[key] === to);
    if (targetSocket) {
      io.to(targetSocket).emit('private-message', { from, message });
    }
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user-list', Object.values(users));
  });
});

app.get('/', (req, res) => {
  res.send('Chat server running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
