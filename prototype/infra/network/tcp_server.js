'use strict';
let net = require('net');

class TcpServer {
    constructor(ip, port, connectionHandler, listeningHandler) {
        this.ip = ip || '127.0.0.1'
        this.listenPort = port || 1336;
        this.connectionHandler = connectionHandler;
        this.tcpSrv = net.createServer(connectionHandler.onPlayerConnected.bind(connectionHandler));
        this.tcpSrv.on('listening', listeningHandler)
    }

    start(cb) {
        console.log('Listening on ' + this.ip + ':' + this.listenPort)
        this.tcpSrv.listen(this.listenPort, this.ip, cb);
    }

    stop(cb) {
        this.tcpSrv.close(cb);
        this.connectionHandler.close();
    }

    port() {
        return this.listenPort;
    }
}

exports.TcpServer = TcpServer