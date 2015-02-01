window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.URL = window.URL || window.mozURL || window.webkitURL;
window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;

function attachMediaStream(element, stream) {
  'use strict';
  if (typeof element.srcObject !== 'undefined') {
    element.srcObject = stream;
  } else if (typeof element.mozSrcObject !== 'undefined') {
    element.mozSrcObject = stream;
  } else if (typeof element.src !== 'undefined') {
    element.src = URL.createObjectURL(stream);
  } else {
    console.log('Error attaching stream to element');
  }
}

function requestUserMedia(constraints) {
  'use strict';
  return new Promise(function (resolve, reject) {
    var onSuccess = function (stream) {
      resolve(stream);
    },
      onError = function (error) {
        reject(error);
      };

    try {
      window.navigator.getUserMedia(constraints, onSuccess, onError);
    } catch (e) {
      reject(e);
    }
  });
}