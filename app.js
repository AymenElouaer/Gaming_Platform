const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const googleAuth = require('./routes/googleUsers');
const facebookAuth = require('./routes/facebookUsers');
const discussionRouter = require('./routes/discussions');
const messageRouter = require('./routes/messages');
const stripeRouter = require('./routes/stripe');
const walletRouter = require('./routes/wallet');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server);


const CONNECTION_URL = 'mongodb+srv://aymenelouaer97:qSCsZbsoYK6VV0OA@cluster0.qmwmrkv.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(CONNECTION_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

io.on('connection', function (socket) {
  console.log('User connected:', socket.id);
  joinRoom(socket, io);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', googleAuth);
app.use('/auth', facebookAuth);
app.use('/discussions', discussionRouter);
app.use('/', messageRouter);
app.use('/stripe', stripeRouter);
app.use('/wallet', walletRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;