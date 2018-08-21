const assert = require('assert');
const net = require('net');
const sinon = require("sinon");
const EventDispatcher = require("../../infrastructure/network/event_dispatcher").EventDispatcher
const MessageParser = require("../../infrastructure/network/message_parser").MessageParser

const Server = require("../../infrastructure/server").Server
const Client = require("./utils/client").Client
const Messages = require("../../infrastructure/network/message_parser").Messages
const EventsOut = require("../../infrastructure/network/events").EventsOut

describe('Server end-2-end tests', function () {

    var server
    var parser

    beforeEach(function () {
        server = new Server()
        sinon.stub(server.db, 'queryUserAuthData').returns('someHash')
        sinon.stub(server.auth.hasher, 'compare').resolves(true)
        parser = new MessageParser()
    })

    afterEach(function () {
       server.stop()
    })

    describe('general', function () {
        it('should server response only to one client', function (done) {

            let max = 10
            let ready = 0
            let client_cnt = 0

            server.start()

            function connClient(i) {

                console.log('create client ' + i)

                if(i===5)
                    return new Promise(conn_)
                else
                {
                    conn_()
                    return
                }

                function conn_(res, rej) {
                    let disp = new EventDispatcher()
                    var client = new Client(i, server.port(), disp)
                    client.init()
                    client.id = i

                    disp.onWelcome(() => {
                        // only one client send login
                        if (i === 5) {
                            let payload = new Messages.MsgLogin('login' + client.id, 'pass1')
                            let msg = new Messages.MsgHeader()
                            client.client.write(msg.serialize(payload.serialize()))
                        }
                    })

                    disp.onAuthValid((a) => {
                        ready++
                        if(res)
                            res()
                    })

                    disp.onAuthInvalid(() => {
                        if(rej)
                            rej()
                    })
                }
            }

            for(let i=0;i<max;++i) {
                let conn = connClient(i)
                if(i === 5) {
                    conn.then(()=>{
                        assert.equal(ready, 1)
                        done()
                    }).catch((err)=>{
                        done(err)
                    })

                }
            }
        });
    })

    describe('authentication', function (){

        it('should server expect Login packet after hello message received', function (done) {

            let max = 2
            let ready = 0
            let client_cnt = 0

            server.start()

            function connClient(i) {

                console.log('create client ' + i)
                return new Promise((res, rej)=>{
                    let disp = new EventDispatcher()
                    var client = new Client(i, server.port(), disp)
                    client.init()

                    disp.onWelcome(()=>{
                        let payload = new Messages.MsgLogin('login'+i, 'pass1')
                        let msg = new Messages.MsgHeader()
                        client.client.write(msg.serialize(payload.serialize()))
                    })

                    disp.onAuthValid((a)=>{
                        ready++
                        res()
                    })

                    disp.onAuthInvalid(()=>{
                        rej()
                    })
                })
            }

            let prom = []
            for(let i=0;i<max;++i) {
                prom.push(connClient(i));
            }

            Promise.all(prom).then(()=>{
                assert.equal(ready, max)
                done()
            }).catch(function (reason) {
                //throw new Error(reason)
            })

        });

        it('should respond with session id when valid login and password', function (done) {
            let max = 1
            let ready = 0
            let client_cnt = 0

            server.start()

            function connClient(i) {

                console.log('create client ' + i)
                return new Promise((res, rej)=>{
                    let disp = new EventDispatcher()
                    var client = new Client(i, server.port(), disp)
                    client.init()

                    disp.onWelcome(()=>{
                        let payload = new Messages.MsgLogin('login'+i, 'pass1')
                        let msg = new Messages.MsgHeader()
                        client.client.write(msg.serialize(payload.serialize()))
                    })

                    //TODO client id is always transfered in event
                    // Event has always its client (maybe not always?)
                    // clientid in event is passed by MessageParser.messageToEvent on client side
                    disp.onAuthValid((clientId, login, session)=>{
                        assert.equal('login'+i, login)
                        assert.notEqual(undefined, session)
                        ready++
                        res()
                    })

                    disp.onAuthInvalid(()=>{
                        rej()
                    })
                })
            }

            let prom = []
            for(let i=0;i<max;++i) {
                prom.push(connClient(i));
            }

            Promise.all(prom).then(()=>{
                assert.equal(ready, max)
                done()
            }).catch(function (reason) {
                //throw new Error(reason)
            })
        });

        it('should respond with fail auth when invalid login or password', function (done) {
            server.auth.hasher.compare.restore()
            sinon.stub(server.auth.hasher, 'compare').resolves(false)
            let max = 2
            let ready = 0
            let client_cnt = 0

            server.start()

            function connClient(i) {

                console.log('create client ' + i)
                return new Promise((res, rej)=>{
                    let disp = new EventDispatcher()
                    var client = new Client(i, server.port(), disp)
                    client.init()

                    disp.onWelcome(()=>{
                        let payload = new Messages.MsgLogin('login'+i, 'pass12222')
                        let msg = new Messages.MsgHeader()
                        client.client.write(msg.serialize(payload.serialize()))
                    })

                    //TODO client id is always transfered in event
                    // Event has always its client (maybe not always?)
                    // clientid in event is passed by MessageParser.messageToEvent on client side
                    disp.onAuthValid((clientId, login, session)=>{
                        rej()
                    })

                    disp.onAuthInvalid(()=>{
                        ready++
                        res()
                    })
                })
            }

            let prom = []
            for(let i=0;i<max;++i) {
                prom.push(connClient(i));
            }

            Promise.all(prom).then(()=>{
                assert.equal(ready, max)
                done()
            }).catch(function (reason) {
                //throw new Error(reason)
            })
        });
    })

    describe('authentication2', function (){
        it('should disconnect when session id not in message', function (done) {
            server.start()
            let disp = new EventDispatcher()
            var client = new Client('c1', server.port(), disp)
            client.init()

            let authDone = false
            disp.onWelcome(()=>{
                let payload = new Messages.MsgLogin('login', 'pass12222')
                let msg = new Messages.MsgHeader()
                client.client.write(msg.serialize(payload.serialize()))
            })

            disp.onAuthValid((clientId, login, session)=>{
                // has session but do not send
                let msg = new Messages.MsgClickField(2)
                client.client.write(msg.serialize())
                authDone = true
            })

            disp.onDisconnect(()=>{
                if(authDone) {
                    done()
                }
            })
        });
        
        it('should disconnect when session id doesnt match', function () {
            
        })
        
        it('should route messages to proper context of session', function () {
            
        })
    })

    describe('connection', function () {
        it('should server send disconnection to all users on stop', function (done) {

            let max = 5
            let ready = 0

            //setTimeout(()=>{done(new Error('timeout'))}, 1500)
            server.start()

            function connClient(i) {
                return new Promise((res, rej)=>{
                    let disp = new EventDispatcher()
                    var client = new Client(i, server.port(), disp)
                    client.init()
                    client.on('connected', function (socket) {
                        socket.on('data', function (data) {
                            let event = parser.messageToEvent(i, data)

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

            function connClient(i) {
                return new Promise((res, rej)=>{
                    let disp = new EventDispatcher()
                    var client = new Client(i, server.port(), disp)
                    client.init()
                    client.on('connected', function (socket) {
                        socket.on('data', function (data) {
                            let event = parser.messageToEvent(i, data)

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



})

