/*jslint node: true */
"use strict";

module.exports = function() {

    var streamList = {};

    var Stream = function(name) {
        this.name = name;
    };

    return {
        addStream: function(id, name) {
            var stream = new Stream(name);
            streamList[id] = stream;
        },

        removeStream: function(id) {
            delete streamList[id];
        },

        update: function(id, name) {
            var stream = streamList[id];
            stream.name = name;

            this.removeStream(id);
            streamList[id] = stream;
        },

        getStreams: function() {
            return streamList;
        }
    };
};
