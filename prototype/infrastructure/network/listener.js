'use strict';
let net = require('net');
const Messages = require("./message_parser").Messages
const Events = require("./events").EventsIn
const EventsOut = require("./events").EventsOut
const EventsLogic = require("../../game/logic/events").EventsLogic
const shortid = require('shortid');

class TcpServer {
    constructor(connectionListener) {
        this.listenPort = 1336
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
        this.clientIdBySession = {}
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

        // very new socket gets its tmp id needed for Auth routing
        // when data arrived it could contains session id or not
        // those without session id are packet before auth
        // with session id are after auth
        //TODO this must be extracted to separate classes. listen should only dispatch messages not manage session/clientId
        socket.clientId = 'tmp#'+shortid.generate()

        this.clientsById[socket.clientId] = socket

        self.sockets.push(socket)

        self.eventDispatcher.dispatch(new EventsLogic.EventPlayerConnected())

        //TODO every message should have client id?
        // 1. login msg omit session check
        // 2. every other message must pass session check
        socket.on('data', function (data) {

            function sessionCheck(sessionStr) {
                return sessionStr && (sessionStr in self.clientIdBySession)
            }

            function needSessionCheck(msg) {
                //TODO not nice fromBuffer use to check instance. Second use is in messageToEvent
                return !self.messageParser.isLogin(msg)
            }

            try {
                let header = self.messageParser.readHeader(data)

                if(!header) {
                    // all incoming messages must have MsgHeader
                    // log that event
                    return
                }

                let clientId = this.clientId

                let d = self.messageParser.removeHeader(data)

                if(needSessionCheck(d) && !sessionCheck(header.sessionStr)) {
                    //TODO do we need dispatch event or directly use socket.write ?
                    let event = new EventsOut.EventDisconnect(clientId)
                    self.eventDispatcher.dispatch(event)
                } else {
                    let event = self.messageParser.messageToEvent(clientId, d)
                    self.eventDispatcher.dispatch(event)
                }


            } catch(err) {
                console.log(err)
            }
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

        //TODO onDisconnect and onAuthValid has common things. For instance routing can be extracted
        self.eventDispatcher.onDisconnect(function (clientId) {
            let msg = new Messages.MsgDisconnect()

            let socket = self.clientsById[clientId]
            console.log('('+socket.clientId+')' + ' will be disconnected ')
            if(socket) {
                socket.end(msg.serialize())


                //TODO refactor this
                var idx = self.sockets.indexOf(socket);
                if (idx !== -1) {
                    self.sockets.splice(idx, 1);
                }


                delete self.clientsById[clientId]

                for(let session in self.clientIdBySession) {
                    if(self.clientIdBySession.hasOwnProperty(session)) {
                        if(self.clientIdBySession[session] === clientId) {
                            delete self.clientIdBySession[session]
                            break
                        }
                    }
                }


            } else  {
                throw new Error('not such socket:'+clientId)
            }
        })


        self.eventDispatcher.onAuthValid(function (clientId, login, sessionStr) {
            let msg = new Messages.MsgAuthValid(login, sessionStr)

            self.clientIdBySession[sessionStr] = clientId

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