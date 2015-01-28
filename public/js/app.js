'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
  config(function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/room/:roomId', {
        templateUrl: '/partials/roomDetail',
        controller: 'roomDetailController'
      }).
      when('/room', {
        templateUrl: '/partials/room',
        controller: 'roomController'
      }).
      when('/group', {
        templateUrl: '/partials/group',
        controller: 'groupController'
      }).
      otherwise({
        redirectTo: '/room'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });
