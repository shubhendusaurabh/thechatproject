'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'ngRoute',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/room', {
      templateUrl: 'partials/room',
      controller: 'MyCtrl1'
    }).
    when('/group', {
      templateUrl: 'partials/group',
      controller: 'MyCtrl2'
    }).
    otherwise({
      redirectTo: '/room'
    });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});
