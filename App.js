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
  removeUser,
} = require('./users');

const io = useSocket(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const formatsLogger =
  app.get('env') === 'development' ? 'dev' : 'short';
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cors(corsOptions));

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
    io.to(user.room).emit('room', {
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

  socket.on('leftRoom', ({ params }) => {
    const user = removeUser(params);

    if (user) {
      io.to(user.room).emit('message', {
        data: {
          user: { name: 'Bot', avatar: '' },
          message: `${user.name} has left chat`,
        },
      });

      io.to(user.room).emit('room', {
        data: {
          room: user.room,
          users: getRoomsUsers(user.room),
        },
      });
    }
  });

  socket.on('disconnect', () => console.log('Disconnect'));
});

module.exports = server;
