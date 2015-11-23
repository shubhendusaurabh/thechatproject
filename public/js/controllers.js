'use strict';

/* Controllers */
var roomControllers = angular.module('myApp.controllers', []);

roomControllers.
controller('roomController', ['$scope', '$rootScope', '$location', '$routeParams', '$anchorScroll', '$WS', 'Room', 'Stream', function($scope, $rootScope, $location, $routeParams, $anchorScroll, $WS, Room, Stream) {

  var webrtc = new SimpleWebRTC({
    localVideoEl: 'my',
    remoteVideosEl: 'others',
    autoRequestMedia: true,
    logger: console
  });
  $scope.fileList = [];
  $scope.messages = [];
  $scope.roomId = $routeParams.roomId;
  $scope.enableVideo = true;
  $scope.messages = [{
    text: 'Are we meeting today?',
    username: 'shubhu',
  }, {
    text: 'Only if you say so!',
    username: 'ij'
  }, {
    text: 'I know so',
    username: 'shubhu'
  }, {
    text: 'I reckon so',
    username: 'sims'
  }];

  $scope.sendMessage = function() {
    // webrtc.sendToAll("socket-chat", {message: $scope.text });
    webrtc.sendDirectlyToAll('text-chat', 'datachannel-chat', {
      message: $scope.text
    });
    if ($scope.text) {
      var msg = {};
      msg.username = 'shubhu';
      msg.text = $scope.text;
      $scope.messages.push(msg);
      $scope.text = '';
    }

    // console.log(webrtc.getPeers());
  };

  // $scope.attachMedia = function() {
  //   Stream.get().then(function(stream) {
  //     $scope.videoContainer = document.querySelector('#my');
  //     $scope.stream = stream;
  //     attachMediaStream($scope.videoContainer, $scope.stream);
  //     $scope.myLoading = false;
  //     Room.init($scope.stream);
  //   });
  // }

  if (!$scope.roomId) {
    Room.createRoom().then(function(roomId) {
      $location.path('/room/' + roomId);
    });
  } else {
    console.log('joining room');
    Room.joinRoom($scope.roomId);
    webrtc.on('readyToCall', function() {
      webrtc.joinRoom($scope.roomId);
    })
  }

  // webrtc.on('channelClose', function(data) {
  //   console.log('cahnnel clsoe', data);
  // });
  //
  // webrtc.on('channelError', function(data) {
  //   console.log(data);
  // });
  /*
  webrtc.on('createdPeer', function(peer) {
    console.log('running');
    var fileInput = document.querySelector('#sendFile');
    fileInput.addEventListener('change', function() {
      // $scope.fileList.push({name: 'hellochange'});
      fileInput.disabled = true;

      var file = fileInput.files[0];
      var sender = peer.sendFile(file);
      $scope.fileList.push(file);
      if (!$rootScope.$$digest) {
        $rootScope.$apply();
      }
      sender.on('progress', function(bytesSent) {
        let progress = (bytesSent / file.size) * 100
        $('progress-bar').css('width', progress + '%');
      });

      sender.on('sentFile', function() {
        fileInput.removeAttribute('disabled');
      });

      sender.on('complete', function() {
        console.log('file transfer complete');
      })
    });
    console.log('Created Peer', peer);

    peer.on('fileTransfer', function(metadata, receiver) {
      console.log('incoming file transfer', metadata.name, metadata);
      receiver.on('progress', function(bytesReceived) {
        console.log('receive progress', bytesReceived, 'out of', metadata.size);
      });

      receiver.on('receivedFile', function(file, metadata) {
        console.log('received file', metadata.name, metadata.size);
        receiver.channel.close();
      });
      $scope.fileList.push(metadata);
      if (!$rootScope.$$digest) {
        $rootScope.$apply();
      }
      console.log($scope.fileList);
    })

  });
  // webrtc.on('channelMessage', function(data) {
  //   // console.log(data.channels['text-hat']);
  //   if(data.type==='datachannel-chat' || data.type == 'socket-chat') {
  //     $scope.messages.push(data.payload.message);
  //     console.log(data.type);
  //   }
  // });
  */
  $WS.ready(function() {
    $WS.on('message', function(data) {
      console.log(data);
      $scope.messages.push(data);
    });

    $WS.on('connected', function(data) {
      console.log(data);
    });

  });

}]);

roomControllers.
controller('groupController', function($scope, $anchorScroll) {
  $scope.users = [{
    username: 'shubhu',
    since: '2 hours ago',
    avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg'
  }, {
    username: 'ij',
    since: 'just now',
    avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_02.jpg'
  }, {
    username: 'sims',
    since: '3 days',
    avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_03.jpg'
  }];

  $scope.messages = [{
    text: 'Are we meeting today?',
    username: 'shubhu',
  }, {
    text: 'Only if you say so!',
    username: 'ij'
  }, {
    text: 'I know so',
    username: 'shubhu'
  }, {
    text: 'I reckon so',
    username: 'sims'
  }];

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
  function($scope, $routeParams, $WS) {
    console.log('settings page');
  }
]);

roomControllers.
controller('helpController', ['$scope', '$routeParams', '$WS',
  function($scope, $routeParams, $WS) {
    $scope.tabs = [{
      title: 'FAQ',
      content: 'Frequently Asked Questions'
    }, {
      title: 'Contact Us',
      content: 'Contact the admin'
    }, {
      title: 'Policies',
      content: 'Our content policy is to help everyone.'
    }, {
      title: 'Cookies',
      content: 'Cookies help us to make better experience for our users'
    }, {
      title: 'Terms of Service',
      content: 'We reserve the right to terminate service at any time.'
    }];
  }
]);

roomControllers.
controller('userProfileController', ['$scope', '$routeParams', '$WS',
  function($scope, $routeParams, $WS) {
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
  function($scope, $routeParams, $WS) {
    console.log('accoutn page');
    $scope.username = $routeParams.username;
  }
]);
