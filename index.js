const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://onlinechatapp-client.vercel.app/', // or your Vercel frontend URL
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('private-message', ({ recipientId, message }) => {
    io.to(recipientId).emit('private-message', {
      senderId: socket.id,
      message
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Server is running...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
