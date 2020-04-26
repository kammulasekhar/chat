var createError = require('http-errors');
var express = require('express');
var session  = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {wsEngine: 'ws'});
var port = process.env.PORT || 3000;
var md5 = require('md5');
var passport = require('passport');
global.clients = [];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var sessionMiddleware = session({
  secret: 'sessionscrete',
  resave: true,
  saveUninitialized: true
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

app.use('/angularjs', express.static(__dirname + '/node_modules/angular/'));
app.use('/ui-router', express.static(__dirname + '/node_modules/@uirouter/angularjs/release'));
app.use('/toastr', express.static(__dirname + '/node_modules/angular-toastr/dist/'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
var db = require('./modules/database');
require('./modules/passport')(passport, md5, db);
require('./modules/socket')(io, md5, db);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.listen(port);
module.exports = app;
