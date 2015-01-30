/* global RTCIceCandidate, RTCSessionDescription, RTCPeerConnection, EventEmitter */
'use strict';

/* Services */
var roomServices = angular.module('myApp.services', []);

roomServices.service('Room', function ($rootScope, $q, $WS) {
  var iceConfig = { 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]},
    peerConnections = {},
    currentId,
    roomId,
    stream;
  
  function getPeerConnection(id) {
    if (peerConnections[id]) {
      return peerConnections[id];
    }
    var pc = new RTCPeerConnection(iceConfig);
    peerConnections[id] = pc;
    pc.addStream(stream);
    pc.onicecandidate = function (event) {
      $WS.emit('msg', {by: currentId, to: id, ice: event.candidate, type: ice });
    };
    pc.onaddstream = function (event) {
      console.log('Recieved new stream');
      api.trigger('peer.stream', [{
        id: id,
        stream: event.stream
      }]);
      if (!$rootScope.$$digest) {
        $rootScope.$apply();
      }
    };
    return pc;
  }
  
  function makeOffer(id) {
    var pc = getPeerConnection(id);
    pc.createOffer(function (sdp) {
      console.log('Creating an offer for', id);
      $WS.emit('msg', { by: currentId, to: id, sdp: sdp, type: 'sdp-offer' });
      
    }, function (error) {
      console.log(error);
    }, { mandatory: {OfferToRecieveVideo: true, OfferToReceiveAudio: true }});
  }
  
  function handleMessage(data) {
    var pc = getPeerConnection(data.by);
    switch (data.type) {
    case 'sdp-offer':
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
        console.log('Setting remote description by offer');
        pc.createAnswer(function (sdp) {
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
        console.log('Adding ice candidates');
        pc.addIceCandidate(new RTCIceCandidate(data.ice));
      }
      break;
    }
  }
  
  function addHandlers($WS) {
    $WS.on('peer.connected', function (params) {
      makeOffer(params.id);
    });
    $WS.on('peer.disconnected', function (data) {
      api.trigger('peer.disconnected', [data]);
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
        d.resolve(roomid);
        roomId = roomid;
        currentId = id;
        connected = true;
      });
      return d.promise;
    },
    init: function (s) {
      stream = s;
    }
  };
  
  //EventEmitter.call(api);
  //Object.setPrototypeOf(api, EventEmitter.prototype);
  
  addHandlers($WS);
  return api;
});

roomServices.
  factory('videoStream', function ($q) {
  var stream;
  return {
    get: function () {
      if (stream) {
        return $q.when(stream);
      } else {
        var d = $q.defer();
        navigator.getUserMedia({
          video: true,
          audio: true
        }, function (s) {
          stream = s;
          d.resolve(stream);
        }, function (e) {
          d.reject(e);
        });
        return d.promise;
      }
    }
  };
});

roomServices.
  value('version', '0.1');
