/*jslint node: true */
"use strict";

var _ = require("underscore"),
  events = require("events"),
  sanitize = require("validator"),
  express = require("express");

var app = express();
var server = app.listen(process.env.PORT || 3000);
var configurations = module.exports;

var settings;
var sockets;

settings = require("./settings")(app, configurations, express);
sockets = require("./app/sockets")(server);

var logger = new events.EventEmitter();
logger.on("newEvent", function (event, data) {
  console.log("%s: %s", event, JSON.stringify(data));
});

/*exported sanitizeMessage */
var sanitizeMessage = function (req, res, next) {
  if (req.body.msg) {
    req.sanitizeMessage = sanitize(req.body.msg).xss();
    next();
  } else {
    res.send(400, "No message provided");
  }
};


// Routes
require('./routes')(app);