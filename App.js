const logger = require('morgan');
const useSocket = require('socket.io');
const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);

const authRouter = require('./routes/api/auth');
const {
  addUser,
  findUser,
  getRoomsUsers,
} = require('./users');

const io = useSocket(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
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
  socket.on('join', ({ name, room, avatar }) => {
    socket.join(room);

    const { user } = addUser({ name, room, avatar });

    socket.emit('message', {
      data: {
        user: { name: 'Bot', avatar: '' },
        message: `Hello, ${user.name}`,
      },
    });

    socket.broadcast.to(user.room).emit('message', {
      data: {
        user: { name: 'Bot', avatar: '' },
        message: `${user.name} has join`,
      },
    });
    io.to(user.room).emit('joinRoom', {
      data: {
        room: user.room,
        users: getRoomsUsers(user.room),
      },
    });
    getRoomsUsers;
  });

  socket.on('send', ({ message, params }) => {
    const user = findUser(params);

    if (user) {
      io.to(user.room).emit('message', {
        data: { user, message },
      });
    }
  });

  socket.on('disconnect', ({ name, room }) => {
    socket.disconnect(room);

    socket.emit('message', {
      data: {
        user: { name: 'Bot', avatar: '' },
        message: `${name} has left the chat`,
      },
    });
  });
});

module.exports = server;
