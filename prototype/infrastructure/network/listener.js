'use strict';
let net = require('net');
const Messages = require("./message_parser").Messages
const Events = require("./events").EventsIn
const EventsLogic = require("./../logic/events").EventsLogic
const shortid = require('shortid');

class TcpServer {
    constructor(connectionListener) {
        this.listenPort = 1334
        this.tcpSrv = net.createServer(connectionListener);
    }

    start() {
        this.tcpSrv.listen(this.listenPort, '127.0.0.1');
    }

    stop(cb) {
        this.tcpSrv.close(cb)
    }

    port() {
        return this.listenPort
    }
}

class ConnectionListener  {

    constructor(messageParser, eventDispatcher) {
        this.messageParser = messageParser;
        this.eventDispatcher = eventDispatcher;
        this.tcpSrv = new TcpServer(this.onPlayerConnected.bind(this) );
        this.version = {}
        this.sockets = []
        this.clientsById = {}
        this.connHook = undefined
        this.started = false
    }

// public

    start() {
        this.started = true
        this.tcpSrv.start()
    }

    disconnectClients() {
        let msg = new Messages.MsgDisconnect().serialize();
        this.sockets.forEach((socket)=>{socket.end(msg)})
    }

    stop(cb) {
        if(this.started) {
            this.tcpSrv.stop(cb)
            this.disconnectClients()
            this.started = false
        }
    }

    port() {
        return this.tcpSrv.port()
    }

    setVersion(major, minor, patch) {
        this.version = {"major": major, "minor": minor, "patch": patch}
    }

    welcomeMessage() {
        let msg = 'Connected to server'
        let major = this.version.major || 0
        let minor = this.version.minor || 0
        let patch = this.version.patch || 0
        let welcome = new Messages.MsgWelcome([major, minor, patch], msg)
        return welcome.serialize()
    }

    unregisterClient(socketToUnreg) {
        let self = this

        function findById(id) {
            for (let i = 0; i < self.sockets.length; i++) {
                if(self.sockets[i].id === id) {
                    return i;
                }
            }
        }

        let idx = findById(socketToUnreg.id)
        delete this.sockets[idx]
        this.sockets.splice(idx, 1)

        delete this.clientsById[socketToUnreg.id]
    }

    onPlayerConnected(socket) {
        var self = this

        if(self.connHook) self.connHook();

        socket.write(this.welcomeMessage());

        socket.clientId = shortid.generate()

        this.clientsById[socket.clientId] = socket

        self.sockets.push(socket)

        self.eventDispatcher.dispatch(new EventsLogic.EventPlayerConnected())

        //TODO every message should have client id?
        socket.on('data', function (data) {
            let event = self.messageParser.messageToEvent(this.clientId, data)
            self.eventDispatcher.dispatch(event)
        })

        socket.on('end', function () {
            self.unregisterClient.call(self, socket)
            self.eventDispatcher.dispatch(new Events.EventPlayerAboutToCloseSocket())
        })

        socket.on('close', function () {
            self.unregisterClient.call(self, socket)
            self.eventDispatcher.dispatch(new Events.EventPlayerCloseSocket())
        })

        // outgoing handlers

        self.eventDispatcher.onAuthValid(function (clientId, login, sessionStr) {
            let msg = new Messages.MsgAuthValid(login, sessionStr)

            //TODO taking just socket here and listening on dispatcher gives sending to all every message
            //TODO should send only to interested socked
            let socket = self.clientsById[clientId]
            console.log('('+socket.clientId+')' + ' handling onAuthValid: '+login+'('+sessionStr+')')

            if(socket) {
                socket.write(msg.serialize())
            } else  {
                throw new Error('not such socket:'+clientId)
            }
        })

        self.eventDispatcher.onAuthInvalid(function () {
            let msg = new Messages.MsgAuthInvalid()
            socket.write(msg.serialize())
        })
    }
}

exports.ConnectionListener = ConnectionListener