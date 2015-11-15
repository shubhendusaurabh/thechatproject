/* global RTCIceCandidate, RTCSessionDescription, RTCPeerConnection */
'use strict';

/* Services */
var roomServices = angular.module('myApp.services', []);

roomServices.service('Room', function ($rootScope, $q, $WS) {
  var iceConfig = { 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]},
    peerConnections = {},
    currentId,
    remoteId,
    connected,
    roomId,
    stream,
    localPeerConnection,
    remotePeerConnection;

  function getPeerConnection(id) {
    if (peerConnections[id]) {
      return peerConnections[id];
    }
    var pc = new RTCPeerConnection(iceConfig);
    peerConnections[id] = pc;
    pc.onicecandidate = function (event) {
      console.log(currentId, id);
      $WS.emit('msg', { by: currentId, to: id, ice: event.candidate, type: 'ice' });
    };
    pc.onaddstream = function (event) {
      console.log('Recieved new stream');
      $WS.emit('user.stream', {
        id: id,
        stream: event.stream
      });
      if (!$rootScope.$$digest) {
        $rootScope.$apply();
      }
    };
    if (stream) {
      pc.addStream(stream);
    }
    return pc;
  }

  function makeOffer(id) {
    var pc = getPeerConnection(id);
    pc.createOffer(function (sdp) {
      console.log('Creating an offer for', currentId, id);
      $WS.emit('msg', { by: currentId, to: id, sdp: sdp, type: 'sdp-offer' });
    }, function (error) {
      console.error(error);
    }, { mandatory: {OfferToRecieveVideo: true, OfferToReceiveAudio: false }});
  }

  function handleMessage(data) {
    var pc = getPeerConnection(data.by);
    switch (data.type) {
    case 'sdp-offer':
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
        console.log('Setting remote description by offer');
        pc.createAnswer(function (sdp) {
          console.log(sdp);
          pc.setLocalDescription(sdp);
          $WS.emit('msg', { by: currentId, to: data.by, sdp: sdp, type: 'sdp-answer' });
        });
      });
      break;
    case 'sdp-answer':
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
        console.log('Setting remote description by answer');
      }, function (error) {
        console.error(error);
      });
      break;
    case 'ice':
      if (data.ice) {
        console.log('Adding ice candidates', data.ice);
        pc.addIceCandidate(new RTCIceCandidate(data.ice));
      }
      break;
    }
  }

  function addHandlers($WS) {
    $WS.on('user.connected', function (params) {
      if (params.id !== currentId) {
        console.log('connected user id is', params.id);
        makeOffer(params.id);
      }
    });
    $WS.on('user.disconnected', function (data) {
      $WS.emit('user.disconnected', data);
      if (!$rootScope.$$digest) {
        $rootScope.$apply();
      }
    });
    $WS.on('msg', function (data) {
      handleMessage(data);
    });
  }

  var api = {
    joinRoom: function (room) {
      if (!connected) {
        $WS.emit('init', {room: room}, function (roomid, id) {
          currentId = id;
          roomId = roomid;
        });
        connected = true;
      }
    },
    createRoom: function () {
      var d = $q.defer();
      $WS.emit('init', null, function (roomid, id) {
        roomId = roomid;
        currentId = id;
        connected = true;
        d.resolve(roomid);
      });
      return d.promise;
    },
    init: function (s) {
      stream = s;
    }
  };

  addHandlers($WS);
  return api;
});

roomServices.
  factory('Stream', function ($q) {
  var stream;
  window.constraints = {
    audio: false,
    video: true
  };
  return {
    get: function () {
      if (stream) {
        return $q.resolve(stream);
      } else {
        var d = $q.defer();
        navigator.mediaDevices.getUserMedia(window.constraints).then(function(s){
          stream = s;
          d.resolve(s);
        }).catch(function(error){
          console.error(error);
          d.reject(error);
        });
        return d.promise;
      }
    }
  };
});

roomServices.
  value('version', '0.2');
