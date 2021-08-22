require('dotenv').config();
require('./auth/auth');
const log4js = require('log4js');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const jwt_decode = require('jwt-decode');

const User = require('./models/user');
const Post = require('./models/post');
const Message = require('./models/message');
const auth = require('./routes/auth');
const posts = require('./routes/posts');
const users = require('./routes/users');
const dialog = require('./routes/dialog');
const logger = log4js.getLogger('auth');
logger.level = 'info';

mongoose.connect(`${process.env.DB_LINK}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connection.on('error', (error) => console.log(error));

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.static('images'));

app.use(auth);

app.use(passport.authenticate('jwt', { session: false }), posts);

app.use(passport.authenticate('jwt', { session: false }), users);

app.use(passport.authenticate('jwt', { session: false }), dialog);

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST'],
  }),
);

const usersSockets = new Map();

io.on('connect', (socket) => {
  const userToken = socket.handshake.query.token;
  const senderUserId = jwt_decode(userToken).user._id;
  logger.info(`We have a new connection ${senderUserId} id`);

  usersSockets.set(senderUserId, socket);

  socket.on('sendMessage', async (message) => {
    const recipientId = message.recipientId;
    const messageText = message.messageText;
    const recipientSocket = usersSockets.get(recipientId);

    await Message.create({
      text: messageText,
      author: senderUserId,
      recipient: recipientId,
    });

    socket.emit('message', { user: senderUserId, messageText });
    recipientSocket.emit('message', { user: senderUserId, messageText });
  });

  socket.on('disconnect', () => {
    usersSockets.delete(senderUserId);
    logger.info('User had left');
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message });
});

server.listen(process.env.PORT || 8080, () => {
  console.log('Server started');
});
