/* jslint node: true */
"use strict";

var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var errorhandler = require('errorhandler');

var env = process.env.NODE_ENV || 'development';

module.exports = function(app, configurations, express) {
  var maxAge = 24 * 60 * 60 * 1000 *28;
  
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(morgan('combined'));
  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true}));
  app.use(methodOverride());

  if (env === 'development') {
      app.use(errorhandler({ dumpExceptions: true, showStack: true }));
      app.locals.pretty = true;
  }
  
  if (env === 'production') {
    app.use(compression());
    
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
  }
};