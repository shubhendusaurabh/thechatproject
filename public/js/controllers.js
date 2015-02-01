'use strict';

/* Controllers */
var roomControllers = angular.module('myApp.controllers', []);

roomControllers.
  controller('roomController', ['$scope', '$WS', 'Room', function ($scope, $WS, Room) {
    $scope.messages = [];
    $scope.videoContainer = document.querySelector('#myPublisher');

    requestUserMedia({
      video: true,
      audio: true
    }).then(function(stream){
      console.log(stream);
      attachMediaStream($scope.videoContainer, stream);
    }, function(e){
      console.error('Error' + e);
    });
    $WS.ready(function () {
      $WS.on('message', function (data) {
        console.log(data);
        $scope.messages.push(data);
      });
      
      $WS.on('connected', function (data) {
        console.log(data);
      });
    });

  }]);

roomControllers.
  controller('roomDetailController', ['$scope', '$routeParams', '$WS', function ($scope, $routeParams, $WS) {
    console.log($routeParams.roomId);
  }]);

roomControllers.
  controller('groupController', function ($scope) {
    // write Ctrl here

  });
