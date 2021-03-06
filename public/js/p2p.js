$(function () {

    socket.on('noUser', function (data) {
        console.log(data);
    });
    
    socket.on('nextUser', function (data) {
        console.log(data);
    })

    var room = location.search && location.search.split('?')[1];
    console.log(room);

    var webrtc = new SimpleWebRTC({
        localVideoEl: 'localVideo',
        remoteVideoEl: 'remoteVideo',
        autoRequestMedia: true,
        debug: true
    });

    webrtc.on('readyToCall', function() {
        if (room) webrtc.joinRoom(room);
    });

    webrtc.on('videoAdded', function(video, peer) {
        console.log('video added', peer);
        var remotes = document.getElementById('remoteVideo');
        var d = document.createElement('div');
        d.className = 'remoteVideo';
        d.id = 'container_' + webrtc.getDomId(peer);
        d.appendChild(video);
        video.onclick = function() {
            video.style.width = video.videWidth + 'px';
            video.style.height = video.videoHeight + 'px';
        };
        remotes.appendChild(d);
    });

    webrtc.on('videoRemoved', function(video, peer) {
        console.log('video removed', peer);
        var remotes = document.getElementById('remoteVideo');
        var el = document.getElementById('container_' + webrtc.getDomId(peer));
        if (remotes && el) {
            remotes.removeChild(el);
        }
    });
});