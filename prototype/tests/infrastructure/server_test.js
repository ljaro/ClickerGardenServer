const assert = require('assert');
const net = require('net');
const sinon = require("sinon");
const MessageParser = require("../../infrastructure/network/message_parser").MessageParser

const Server = require("../../infrastructure/server").Server
const Client = require("./utils/client").Client
const Messages = require("../../infrastructure/network/message_parser").Messages
const EventsOut = require("../../infrastructure/network/events").EventsOut

describe('Server', function () {

    var server
    var parser

    beforeEach(function () {
        server = new Server()
        parser = new MessageParser()
    })

    afterEach(function () {
       server.stop()
    })

    it('should server send disconnection to all users on stop', function (done) {
        let max = 5
        let ready = 0

        //setTimeout(()=>{done(new Error('timeout'))}, 1500)
        server.start()

        function connClient() {
            return new Promise((res, rej)=>{
                var client = new Client(server.port())
                client.on('connected', function (socket) {
                    socket.on('data', function (data) {
                        let event = parser.messageToEvent(data)

                        if(event instanceof EventsOut.EventWelcome) {
                            ready++
                            if(ready === max) {
                                server.stop()
                            }
                        }
                        else {
                            assert(event instanceof EventsOut.EventDisconnect)
                            res()
                        }

                    })
                })
            })
        }

        let prom = []
        for(let i=0;i<max;++i) {
            prom.push(connClient(i));
        }

        Promise.all(prom).then(()=>{
            done()
        })


    });

    it('should server send hello msg as first message', function (done) {
        let max = 5

        server.start()

        function connClient() {
            return new Promise((res, rej)=>{
                var client = new Client(server.port())
                client.on('connected', function (socket) {
                    socket.on('data', function (data) {
                        let event = parser.messageToEvent(data)

                        if(event instanceof EventsOut.EventWelcome) {
                            assert(event instanceof EventsOut.EventWelcome)
                            res()
                        }
                    })
                })
            })
        }

        let prom = []
        for(let i=0;i<max;++i) {
            prom.push(connClient(i));
        }

        Promise.all(prom).then(()=>{
            done()
        })
    });

})

