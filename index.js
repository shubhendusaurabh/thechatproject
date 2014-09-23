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
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(methodOverride());

if ('development' == env) {
    app.use(errorhandler());
}

var users = [];

app.get('/', function(req, res){
    res.render('index', {
        title: 'Home'
    });
});

// getnext

app.get('/available', function(req, res){
    res.send({available: users.length});
});

io.sockets.on('connection', function(socket) {
    socket.on("hello", function(jid) {
        users.push({socket: socket.id.toString(), jid: jid});
        io.sockets.emit("queue", users.length);
    });
    socket.on("disconnect", function() {
        var userFilter = users.filter(function (user) {
            return user.socket == socket.id.toString()
        });
        if (userFilter && userFilter.length) {
            users.splice(users.indexOf(userFilter[0]), 1);
            io.sockets.emit("queue", users.length);
        }
    });
});
