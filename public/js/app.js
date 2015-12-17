'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'ngRoute',
  'ngMaterial',
  'myApp.factory',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
  config(function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/room/:roomId', {
        templateUrl: '/partials/room',
        controller: 'roomController'
      }).
      when('/room', {
        templateUrl: '/partials/room',
        controller: 'roomController'
      }).
      when('/group', {
        templateUrl: '/partials/group',
        controller: 'groupController'
      }).
      when('/user/:username', {
        templateUrl: '/partials/user',
        controller: 'accountController'
      }).
      when('/settings', {
        templateUrl: '/partials/settings',
        controller: 'settingsController'
      }).
      when('/help', {
        templateUrl: '/partials/help',
        controller: 'helpController'
      }).
      when('/me', {
        templateUrl: '/partials/account',
        controller: 'userProfileController'
      }).
      when('/me/edit', {
        templateUrl: '/partials/editAccount',
        controller: 'userProfileController'
      }).
      otherwise({
        redirectTo: '/room'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });
