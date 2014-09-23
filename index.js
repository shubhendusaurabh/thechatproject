var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    stylus = require('stylus'),
    nib = require('nib'),
    morgan = require('morgan'),
    errorhandler = require('errorhandler'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
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
    app.use(errorhandler());
    app.locals.pretty = true;
}

var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
    var addedUser = false;

    socket.on('new message', function (data) {
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    socket.on('add user', function (username) {
        socket.username = username;
        usernames[username] = username;
        numUsers += 1;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });

        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
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
            delete usernames[socket.username];
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
    res.send({available: users.length});
});
