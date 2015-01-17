/*jslint node: true */
"use strict";

var _ = require('underscore'),
    http = require('http'),
    events = require('events'),
    stylus = require('stylus'),
    nib = require('nib'),
    sanitize = require('validator'),
    express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000);
var configurations = module.exports;
var io = require('socket.io').listen(server);
var settings = require('./settings')(app, configurations, express);


var users = [];
var numUsers = 0;
var connectedUsers = 0;

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
    connectedUsers++;
    var addedUser = false;
    users.push({"id": socket.id, "available": true});

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
        exists = _.find(users, function(key, value) {
            if (key.username.toLowerCase() === username.toLowerCase())
                return true;
        });
        if (exists) {
            socket.emit('username exists', {msg: "The username exists, please choose another."});
        } else {
            
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
        console.log(users);
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
        connectedUsers--;
        if (addedUser) {
            delete users[socket.username];
            numUsers -= 1;

            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });

    socket.on('getNext', function() {
        
        if (connectedUsers > 1) {
            // get a random user
            var room = Math.random().toString(36).substring(5);
            var randomUser = users[Math.floor(Math.random()*users.length)];
            randomUser = users[1];
            // generate some unique room name for them and return it
            console.log(users);
            socket.emit('nextUser', {user: randomUser});
        } else {
            
            socket.emit('noUser', {msg: 'No other users are available at this moment.'});
        }
    });
});

app.get('/', function(req, res){
    res.render('index', {
        title: 'Home'
    });
});

app.get('/p2p', function(req, res){
    res.render('p2p', {
        title: 'P2P'
    });
});

app.get('/available', function(req, res){
    console.log(numUsers);
    res.send({available: numUsers});
});