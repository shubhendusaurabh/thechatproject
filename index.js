var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    stylus = require('stylus'),
    nib = require('nib'),
    morgan = require('morgan'),
    express = require('express');

var ChatServer = require('./chat.js');

var requireLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login?next=' + req.path);
    }
};

var Server = function (config) {
    var self = this;
    self.config = config;
    self.app = express();

    self.app.set('views', __dirname + '/views')
    self.app.set('view engine', 'jade')
    self.app.use(morgan('combined'))
    self.app.use(express.static(__dirname + '/public'))

}
