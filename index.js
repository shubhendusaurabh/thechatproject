var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    events = require('events'),
    stylus = require('stylus'),
    nib = require('nib'),
    morgan = require('morgan'),
    errorhandler = require('errorhandler'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    sanitize = require('validator'),
    express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io').listen(server);
var env = process.env.NODE_ENV || 'development';

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('combined'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(methodOverride());

if ('development' == env) {
    app.use(errorhandler({ dumpExceptions: true, showStack: true }));
    app.locals.pretty = true;
}

var users = {};
var numUsers = 0;

var logger = new events.EventEmitter();
logger.on('newEvent', function(event, data) {
    console.log('%s: %s', event, JSON.stringify(data));
});

var sanitizeMessage = function(req, res, next) {
    if (req.body.msg) {
        req.sanitizeMessage = sanitize(req.body.msg).xss();
        next();
    } else {
        res.send(400, "No message provided");
    }
};

io.on('connection', function (socket) {
    var addedUser = false;

    socket.emit('connected', 'Welcome to the chat server');
    logger.emit('newEvent', 'userConnect', {'socket': socket.id});

    socket.on('new message', function (data) {
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    socket.on('add user', function (username) {
        var exists = false;
        console.log(users);
        exists = _.find(users, function(key, value) {
            if (key.username.toLowerCase() === username.toLowerCase())
                return true;
        });
        if (exists) {
            socket.emit('username exists', {msg: "The username exists, please choose another."});
        } else {
            socket.username = username;
            users[socket.id] = {"username": username};
            numUsers += 1;
            addedUser = true;
            socket.emit('login', {
                numUsers: numUsers
            });
            socket.broadcast.emit('user joined', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });

    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    socket.on('disconnect', function () {
        if (addedUser) {
            delete users[socket.username];
            numUsers -= 1;

            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});

app.get('/', function(req, res){
    res.render('index', {
        title: 'Home'
    });
});

// getnext

app.get('/available', function(req, res){
    console.log(numUsers);
    res.send({available: numUsers});
});

var sendBroadcast = function(text) {
    _.each(_.keys(io.sockets.manager.rooms), function(room) {
        room = room.substr(1);

        if (room) {
            var message = {'room': room, 'username': 'ServerBot', 'msg': text, 'date': new Date()};
            //io.sockets.in(room).emit('newMessage' message);
        }
    });
    logger.emit('newEvent', 'newBroadcastMessage', {'msg': text});
};

// 404 catch-all handler
app.use(function(req, res, next) {
    res.status(404);
    res.render('404.jade', {title: '404: Page not found!'});
});

// 500 error handler
app.use(function(error, req, res, next) {
    console.error(error.stack);
    res.status(500);
    res.render('500.jade', {title: '500: Internal Server Error', error: error});
});
