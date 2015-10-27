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
    $scope.users = [
      {
        username: 'shubhu',
        since: '2 hours ago',
        avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg'
      },
      {
        username: 'ij',
        since: 'just now',
        avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_02.jpg'
      },
      {
        username: 'sims',
        since: '3 days',
        avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_03.jpg'
      }
    ];

    $scope.messages = [
      {
        text: 'Are we meeting today?',
        username: 'shubhu',
      },
      {
        text: 'Only if you say so!',
        username: 'ij'
      },
      {
        text: 'I know so',
        username: 'shubhu'
      },
      {
        text: 'I reckon so',
        username: 'sims'
      }
    ];

    $scope.sendMessage = function() {
      var msg = {};
      msg.username = 'shubhu';
      msg.text = $scope.text;
      $scope.messages.push(msg);
      $scope.text = '';
    }
  });

roomControllers.
  controller('settingsController', ['$scope', '$routeParams', '$WS',
    function ($scope, $routeParams, $WS) {
      console.log('settings page');
    }
  ]);

roomControllers.
  controller('helpController', ['$scope', '$routeParams', '$WS',
    function ($scope, $routeParams, $WS) {
      $scope.tabs = [
        {
          title: 'FAQ',
          content: 'Frequently Asked Questions'
        },
        {
          title: 'Contact Us',
          content: 'Contact the admin'
        },
        {
          title: 'Policies',
          content: 'Our content policy is to help everyone.'
        },
        {
          title: 'Cookies',
          content: 'Cookies help us to make better experience for our users'
        },
        {
          title: 'Terms of Service',
          content: 'We reserve the right to terminate service at any time.'
        }
      ];
    }
  ]);

roomControllers.
  controller('userProfileController', ['$scope', '$routeParams', '$WS',
    function ($scope, $routeParams, $WS) {
      console.log('user profile page');
      $scope.user = {
        username: 'shubhu',
        aboutMe: 'I am groot',
        gender: 'M',
        country: 'india'
      };
    }
  ]);

roomControllers.
  controller('accountController', ['$scope', '$routeParams', '$WS',
    function ($scope, $routeParams, $WS) {
      console.log('accoutn page');
      $scope.username = $routeParams.username;
    }
]);
