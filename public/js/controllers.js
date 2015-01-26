'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('roomController', ['$scope', '$WS', function ($scope, $WS) {
    $scope.messages = [];
    
    $WS.ready(function () {
      $WS.on('message', function (data) {
        console.log(data);
        $scope.messages.push(data);
      });
      
      $WS.on('connected', function (data) {
        console.log(data);
      });
    });

  }]).
  controller('groupController', function ($scope) {
    // write Ctrl here

  });
