const mongoose = require('mongoose');
const express = require('express')
const app = express();
const server = require('http').Server(app);
const useSocket = require('socket.io');
const io = useSocket(server)

require('dotenv').config();

const { DB_HOST, PORT } = process.env;

app.get('/chat',(req, res)=>{
res.json("HI")
})

io.on('connection', socket => {
  socket.on('chat-message', message => {
    socket.broadcast.emit('chat-message', message);
  });
});

mongoose
.connect(DB_HOST)
.then(() => {
  server.listen(PORT);
  console.log('Database connection successful');
})
.catch(error => {
  console.log(error.message);
  process.exit(1);
});

