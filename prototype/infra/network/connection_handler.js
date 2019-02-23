'use strict';
const net = require('net');
const ChunkProcessor = require('./chunk_processor').ChunkProcessor

class ConnectionHandler {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }

    onPlayerConnected (socket) {
        socket.write('hello')


        let connectionHandler = this;
        ChunkProcessor.initProcessChunk(socket);

        socket.on('data', function(chunk) {
            ChunkProcessor.processChunk(socket, chunk, function (buff) {
                connectionHandler.dispatcher.consume(socket, buff);
            })
        })

        socket.on('end', function () {

        })
    }

    close() {
        this.dispatcher.closeToAll();
    }
}

exports.ConnectionHandler = ConnectionHandler