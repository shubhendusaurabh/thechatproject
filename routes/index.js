'use strict';

module.exports = function (app) {
  var crypto = require('crypto');
  
  var getUserId = function (fingerPrint, ip) {
    return crypto.createHash('md5').update(fingerPrint + ip).digest('hex');
  };
  
  var getSortedChats = function (done) {
    //TODO
  };
  
  var emitChat = function (socket, chat) {
    var fingerPrint = chat.value.finderPrint;
    
    var statMsg = JSON.stringify({
      epoch_ms: Date.now(),
      fingerPrint: fingerPrint
    });
    
    //zio.send([topic, statMsg])
    
    socket.emit('message', {chat: chat});
  };
  
  app.get('/info', function (req, res) {
    res.render('info');
  });

  app.get("/p2p", function (req, res) {
    res.render("p2p", {
      title: "P2P"
    });
  });

  app.get("/available", function (req, res) {
    console.log(numUsers);
    res.send({available: numUsers});
  });
  
  app.get('/ip', function (req, res) {
    res.json({
      ip: req.ip,
      admin: req.session.authenticated || false
    });
  });
  
  app.get('/terms', function (req, res) {
    res.render('terms');
  });
  
  app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    console.log(name);
    res.render('partials/' + name);
  });

  app.get('/room/:roomId', function (req, res) {
    var name = req.params.roomId;
    console.log(name);
    res.render('index');
  })

  app.get("/", function (req, res) {
    res.render("index", {
      title: "Home"
    });
  });
  
  app.get('*', function (req, res) {
    res.render('index');
  });
  
  var addChat = function (message, userId, ip, next) {
    //emit chat here
  };
};