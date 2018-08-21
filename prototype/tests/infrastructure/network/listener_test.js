let assert = require('assert');
var net = require('net');

const sinon = require("sinon");
const MessageParser = require("../../../infrastructure/network/message_parser").MessageParser
const ConnListener = require("../../../infrastructure/network/listener").ConnectionListener
const Events = require("../../../infrastructure/network/events").EventsIn
const EventsOut = require("../../../infrastructure/network/events").EventsOut
const EventsLogic = require("../../../infrastructure/logic/events").EventsLogic
const Messages = require("../../../infrastructure/network/message_parser").Messages
const EventDispatcher = require("../../../infrastructure/network/event_dispatcher").EventDispatcher

describe('TcpServer', function () {

    var server;
    var parser;
    var dispatcher;

    beforeEach(function () {
        sandbox = sinon.createSandbox();

        parser = {
            'messageToEvent': function () {
            },
            'readHeader': function () {
            },
            'removeHeader': function () {
            },
            'isLogin': function () {
            }
        }
        dispatcher = {
            'dispatch': function () {
            },
            'onAuthValid': function () {
            },
            'onAuthInvalid': function () {
            },
            'onDisconnect': function () {
            }
        }
        server = new ConnListener(parser, dispatcher)
    })

    afterEach(function () {
        server.stop()
        sandbox.restore()
    })

    it('server should listen after start', function (done) {
        server.start()

        var client = net.connect({port: server.port()},
            function () {
                console.log('client connected');
                client.end();
                done()
            });
    })

    it('should not send to client when its disconnected', function (done) {
        server.start()

        let client = net.connect({port: server.port()}, function () {
            client.end()
        })

        setTimeout(() => {
            server.stop(); // potentially send to server
            done();
        }, 200);
    });

    it('should not parse incoming packet data if there is no MsgHeader', function (done) {
        let mock = sinon.mock(parser)
        sandbox.stub(parser, 'readHeader').returns(new Messages.MsgHeader('sessionid'))

        server.start()

        mock.expects("messageToEvent").never();

        let client = net.connect({port: server.port()}, function () {
            client.write('sample message without header')
            client.end()
        })

        setTimeout(() => {
            server.stop();
            mock.verify();
            done();
        }, 200);
    })

    it('should parse incoming MsgLogin', function (done) {
        let mock = sinon.mock(parser)
        sandbox.stub(parser, 'readHeader').returns(new Messages.MsgHeader('sessionid'))
        sandbox.stub(parser, 'removeHeader').returns(new Messages.MsgLogin('login', 'pass').serialize())

        server.clientIdBySession['sessionid'] = 'sessionid'
        server.start()

        mock.expects("messageToEvent").once();

        let client = net.connect({port: server.port()}, function () {
            let h = new Messages.MsgHeader()
            let l = new Messages.MsgLogin('login', 'pass')
            client.write(h.serialize(l.serialize()))
            client.end()
        })

        setTimeout(() => {
            server.stop();
            mock.verify();
            done();
        }, 200);
    })

    it('should dispatch incoming packet data', function (done) {
        let mock = sandbox.mock(dispatcher)
        server.clientIdBySession['sessionid'] = 'cos'
        sandbox.stub(parser, 'messageToEvent').returns(new EventsLogic.EventClickField())
        sandbox.stub(parser, 'readHeader').returns(new Messages.MsgHeader('sessionid'))
        server.start()


        let client = net.connect({port: server.port()}, function () {
            mock.expects("dispatch").withArgs(new EventsLogic.EventClickField()).once()
            let data = new Messages.MsgClickField(15).serialize()
            let msg = new Messages.MsgHeader()
            client.write(msg.serialize(data))
        })

        setTimeout(() => {
            mock.verify();
            client.end()
            done()
        }, 200);
    })

    it('should emit EventPlayerConnected', function (done) {
        let mock = sandbox.mock(dispatcher)
        server.start()

        mock.expects("dispatch").withArgs(sinon.match.instanceOf(EventsLogic.EventPlayerConnected)).once();

        let client = net.connect({port: server.port()}, function () {
            client.end()
            mock.verify();
        })

        setTimeout(() => {
            done();
        }, 200);
    });

    it('should handle FIN packet by emitting EventPlayerAboutToCloseSocket event', function (done) {
        let mock = sandbox.mock(dispatcher)
        server.start()

        let client = net.connect({port: server.port()}, function () {
            mock.expects("dispatch").withArgs(sinon.match.instanceOf(Events.EventPlayerAboutToCloseSocket)).once();
            mock.expects("dispatch").withArgs(sinon.match.instanceOf(Events.EventPlayerCloseSocket)).once();
            client.end()
        })

        setTimeout(() => {
            mock.verify();
            done();
        }, 200);
    })

    it('should handle CLOSE packet by emitting EventPlayerCloseSocket event', function (done) {
        let mock = sandbox.mock(dispatcher)
        server.start()

        let client = net.connect({port: server.port()}, function () {
            client.on('data', () => {
                mock.expects("dispatch").withArgs(sinon.match.instanceOf(Events.EventPlayerAboutToCloseSocket)).once();
                mock.expects("dispatch").withArgs(sinon.match.instanceOf(Events.EventPlayerCloseSocket)).once();
                client.destroy()
            })
        })

        setTimeout(() => {
            mock.verify();
            done();
        }, 200);
    });

    it('should send hello message with version set', function (done) {
        let hello = new Messages.MsgWelcome([1, 2, 4], 'Connected to server')
        server.setVersion(1, 2, 4)
        server.start()

        let client = net.connect({port: server.port()}, function () {

            client.on('data', (msg) => {
                client.destroy()
                let expectedMsg = hello.serialize()
                assert(msg.equals(expectedMsg))
                done()
            })
        })

    });

    it('should send hello message with 0.0.0 version when not set', function (done) {
        let hello = new Messages.MsgWelcome([0, 0, 0], 'Connected to server')
        let mp = new MessageParser()
        // server.setVersion(1,2,4)
        server.start()

        let client = net.connect({port: server.port()}, function () {

            client.once('data', (msg) => {

                // console.log(mp.messageToEvent(msg))

                client.destroy()

                let expectedMsg = hello.serialize()
                // assert.equal(msg, expectedMsg, '')
                assert(msg.equals(expectedMsg))
                //


                //server.stop()

                done()
            })
        })
    });

})

