'use strict';

module.exports = function (server) {
  var users = [];
  var numUsers = 0;
  var connectedUsers = 0;
  var rooms = {}, userIds = {};
  var _ = require("underscore");
  var uuid = require('node-uuid');
  var io = require("socket.io").listen(server);
  var words = ['shubhu', 'lol', 'man', 'jazz'];

  io.on("connection", function (socket) {
    connectedUsers += 1;
    var addedUser = false, currentRoom, id;
    users.push({"id": socket.id, "available": true});
    socket.emit("connected", "Welcome to the chat server");

    socket.on('init', function(data, fn) {
      currentRoom = (data || {}).room || words[_.random(0, 3)];
      console.log(currentRoom, socket.id);
      socket.join(currentRoom);
      var room = rooms[currentRoom];
      id = socket.id;

      if (!data) {

        fn(currentRoom, id);
        console.log('Room created, with #', currentRoom);
      } else {
        // if (!room) {
        //   return false;
        // }
        // userIds[currentRoom] += 1;
        // id = userIds[currentRoom];
        fn(currentRoom, id);
        io.in(currentRoom).emit('user.connected', {id: socket.id});
        console.log('Peer connected to room', currentRoom, 'with #', id);
      }

    });


    socket.on('msg', function (data) {
      console.log(data);
      io.in(currentRoom).emit('msg', data);
      // var to = parseInt(data.to, 10);
      // if (rooms[currentRoom] && rooms[currentRoom][to]) {
      //   console.log('redirecting to ', to, 'by', data.by);
      //   rooms[currentRoom][to].emit('msg', data);
      // } else {
      //   console.warn('invalid user');
      // }
    });

    // dead
    socket.on("message.new", function (data) {
      socket.broadcast.emit("message.new", {
        username: socket.username,
        message: data
      });
    });

    // dead code
    socket.on("user.connect", function (username) {
      var exists = false;
      exists = _.find(users, function (key, value) {
        console.log(value);
        if (key.username.toLowerCase() === username.toLowerCase()) {
          return true;
        }
      });
      if (exists) {
        socket.emit("username exists", {msg: "The username exists, please choose another."});
      } else {
        users[socket.id] = {"username": username};
        numUsers += 1;
        addedUser = true;
        socket.emit("login", {
          numUsers: numUsers
        });
        socket.broadcast.emit("user.joined", {
          username: socket.username,
          numUsers: numUsers
        });
      }
      console.log(users);
    });

    socket.on("user.typingStart", function () {
      socket.broadcast.emit("typing", {
        username: socket.username
      });
    });

    socket.on("user.typingStop", function () {
      socket.broadcast.emit("stop typing", {
        username: socket.username
      });
    });

    socket.on("disconnect", function () {
      if (!currentRoom || !rooms[currentRoom]) {
        return false;
      }
      delete rooms[currentRoom][rooms[currentRoom].indexOf(socket)];
      rooms[currentRoom].forEach(function (socket) {
        if (socket) {
          socket.emit('user.disconnected', {id: id});
        }
      });
      // connectedUsers -= 1;
      // if (addedUser) {
      //   delete users[socket.username];
      //   numUsers -= 1;
      //   console.log(users);
      //   socket.broadcast.emit("user left", {
      //     username: socket.username,
      //     numUsers: numUsers
      //   });
      // }
    });

    socket.on("getNext", function () {

      if (connectedUsers > 1) {
        // get a random user
        var randomUser = users[Math.floor(Math.random() * users.length)];
        randomUser = users[1];
        // generate some unique room name for them and return it
        console.log(users);
        socket.emit("nextUser", {user: randomUser});
      } else {
        socket.emit("noUser", {msg: "No other users are available at this moment."});
      }
    });
  });
};
