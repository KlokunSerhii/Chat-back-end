const { Server } = require('socket.io');
const { createServer } = require('https');

require('dotenv').config();

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', socket => {
  socket.on('chat-message', message => {
    socket.broadcast.emit('chat-message', message);
  });
});

module.exports = httpServer;
