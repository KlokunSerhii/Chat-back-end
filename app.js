const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
require('dotenv').config();


// const { Server } = require('socket.io');
// const { createServer } = require('http');


// const httpServer = createServer();

// const io = new Server(httpServer, {
//   cors: {
//     origin: '*',
//   },
// });

io.on('connection', socket => {
  socket.on('chat-message', message => {
    socket.broadcast.emit('chat-message', message);
  });
});

module.exports = server;
