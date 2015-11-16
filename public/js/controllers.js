'use strict';

/* Controllers */
var roomControllers = angular.module('myApp.controllers', []);

roomControllers.
  controller('roomController', ['$scope', '$location', '$routeParams', '$anchorScroll', '$WS', 'Room', 'Stream', function ($scope, $location, $routeParams, $anchorScroll, $WS, Room, Stream) {
    $scope.messages = [];
    $scope.roomId = $routeParams.roomId;
    $scope.enableVideo = true;
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
      if ($scope.text) {
        var msg = {};
        msg.username = 'shubhu';
        msg.text = $scope.text;
        $scope.messages.push(msg);
        $scope.text = '';
      }
    };

    $scope.attachMedia = function() {
      Stream.get().then(function(stream) {
        $scope.videoContainer = document.querySelector('#my');
        $scope.stream = stream;
        attachMediaStream($scope.videoContainer, $scope.stream);
        $scope.myLoading = false;
        Room.init($scope.stream);
      });
    }

    if (!$scope.roomId) {
      Room.createRoom().then(function (roomId){
        $location.path('/room/' + roomId);
      });
    } else {
      console.log('joining room');
      Room.joinRoom($scope.roomId);
    }

    // $WS.ready(function () {
      $WS.on('message', function (data) {
        console.log(data);
        $scope.messages.push(data);
      });

      $WS.on('connected', function (data) {
        console.log(data);
      });

    // });

  }]);

roomControllers.
  controller('groupController', function ($scope, $anchorScroll) {
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
      console.log($scope.text);
      if ($scope.text == '') return false;
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
