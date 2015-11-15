'use strict';

angular
  .module('myApp.factory', [])
  .factory('$WS', function ($rootScope) {

    var self = this;

    self.ready = false;

    self.socket = io.connect(location.host, {
      'connect timeout':    100,
      'reconnection delay': 100
    });

    self.socket.on('init', function () {
      console.log('init');
    });

    self.socket.on('disconnect', function () {
      console.log('socket disconnected');
    });

    self.socket.on('connect', function () {
      console.log('socket connected');
    });

    return {
      ready: function (callback) {
        if (self.ready) {
          callback();
          return;
        }

        self.socket.on('connect', function () {
          $rootScope.$apply(function () {
            self.ready = true;
            callback.apply(self.socket);
          });
        });
      },
      on: function (eventName, callback) {
        self.socket.on(eventName, function () {
          var args = arguments;

          $rootScope.$apply(function () {
            callback.apply(self.socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        self.socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(self.socket, args);
            }
          });
        });
      }
    };
  });
