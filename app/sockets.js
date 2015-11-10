'use strict';

module.exports = function (server) {
  var users = [];
  var numUsers = 0;
  var connectedUsers = 0;
  var rooms, currentRoom;
  var _ = require("underscore");
  var uuid = require('node-uuid');
  var io = require("socket.io").listen(server);

  io.on("connection", function (socket) {
    connectedUsers += 1;
    var addedUser = false;
    users.push({"id": socket.id, "available": true});
    console.log(users);
    socket.emit("connected", "Welcome to the chat server");

    socket.on('init', function(data, fn) {
      currentRoom = (data || {}).room || uuid.v4();
      console.log(rooms);
      var room = rooms[currentRoom];
      if (!data) {
        rooms[currentRoom] = [socket];
        id = userIds[currentRoom] = 0;
        fn(currentRoom, id);
        console.log('Room created, with #', currentRoom);
      } else {
        if (!room) {
          return false;
        }
        userIds[currentRoom] += 1;
        id = userIds[currentRoom];
        fn(currentRoom, id);
        room.forEach(function (s) {
          s.emit('peer.connected', {id: id});
        });
        room[id] = socket;
        console.log('Peer connected to room', currentRoom, 'with #', id);
      }
    });

    socket.on("new message", function (data) {
      socket.broadcast.emit("new message", {
        username: socket.username,
        message: data
      });
    });

    socket.on("add user", function (username) {
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
        socket.broadcast.emit("user joined", {
          username: socket.username,
          numUsers: numUsers
        });
      }
      console.log(users);
    });

    socket.on("typing", function () {
      socket.broadcast.emit("typing", {
        username: socket.username
      });
    });

    socket.on("stop typing", function () {
      socket.broadcast.emit("stop typing", {
        username: socket.username
      });
    });

    socket.on("disconnect", function () {
      connectedUsers -= 1;
      if (addedUser) {
        delete users[socket.username];
        numUsers -= 1;
        console.log(users);
        socket.broadcast.emit("user left", {
          username: socket.username,
          numUsers: numUsers
        });
      }
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
