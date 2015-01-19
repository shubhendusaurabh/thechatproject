'use strict';

module.exports = function (app, io) {
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
  
  app.get('/', function (req, res) {
    res.render('index');
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
  
  var addChat = function (message, userId, ip, next) {
    //emit chat here
  }
}