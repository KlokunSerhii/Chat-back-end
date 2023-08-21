const logger = require('morgan');
const useSocket = require('socket.io');
const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);

const authRouter = require('./routes/api/auth');

const io = useSocket(server, {
  cors: {
    origin: '*',
  },
});

const formatsLogger =
  app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cors());

app.use('/chat/users', authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

io.on('connection', socket => {

  socket.on('chat-message', message => {
    socket.broadcast.emit('chat-message', message);
  });

  socket.on('chat-user', name => {
    socket.broadcast.emit('chat-user', name);
  });

  io.on('disconnect', ()=>
  console.log("Disconnect"))


});

module.exports = server;
