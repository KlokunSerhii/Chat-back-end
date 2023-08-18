const logger = require('morgan');
const useSocket = require('socket.io');
const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);

const authRouter = require('./routes/api/auth');
const { addUser } = require('./users');

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

  socket.on('join', ({name, room}) =>{

    socket.join(room);

    const {user} = addUser({name, room});

    socket.emit('message', {
      data:{user: {name:"Admin"}, message:`Hi ${user.name}`}
    });

      socket.broadcast.to(user.room).emit('message', {
        data:{user: {name:"Admin"}, message:` ${user.name} has joined`}
      });

  });

  socket.on('chat-message', message => {
    socket.broadcast.emit('chat-message', message);


  });


  io.on('disconnect', ()=>
  console.log("Disconnect"))


});

module.exports = server;
