const assert = require('assert');
const net = require('net');
const sinon = require("sinon");
const MessageParser = require("../../../infrastructure/network/message_parser").MessageParser
const Messages = require("../../../infrastructure/network/message_parser").Messages
const EventsIn = require("../../../infrastructure/network/events").EventsIn
const EventsOut = require("../../../infrastructure/network/events").EventsOut
const EventsLogic = require("../../../infrastructure/logic/events").EventsLogic
const Events = require("../../../infrastructure/network/events").Events

describe('MessageParser', function () {

    before(function () {
    })

    after(function () {
    })

    describe('Outgoing messages', function () {

        var parser

        beforeEach(function() {
            parser = new MessageParser()
        })

        describe('Hello message', function () {
            it('version should not exceed 3 bytes', function () {
                let msg = new Messages.MsgWelcome([9999,9999,9999], '')
                let buffer = msg.serialize()
                assert(buffer.length <= 3 + 500)
            })

            it('message should not exceed 500 bytes', function () {
                var str = new Array(501 + 1).join('A');

                let msg = new Messages.MsgWelcome([255,255,255], str)
                let buffer = msg.serialize()
                assert(buffer.length <= 500 + 4)
            })

            it('from buffer should handle malicious buffers (1)', function () {
                let cmd = 7
                let major = 55555
                let minor = 55555
                let patch = 55555
                let str = new Array(555).join('A');
                let message = Buffer.from(str)
                let msgLen = message.length

                let buff = Buffer.concat([Buffer.from([cmd, major, minor, patch, msgLen]), message])

                let msg = Messages.MsgWelcome.fromBuffer(buff)
                assert(msg.msg.length <= 255)
            })

            it('from buffer should handle malicious buffers (2)', function () {
                let cmd = 7
                let major = 55555
                let minor = 55555
                let patch = 55555
                let str = new Array(5).join('A');
                let message = Buffer.from(str)
                let msgLen = 255

                let buff = Buffer.concat([Buffer.from([cmd, major, minor, patch, msgLen]), message])

                let msg = Messages.MsgWelcome.fromBuffer(buff)
                assert.equal(msg, null)
            })

            it('should serialize to Buffer', function () {
                let buffer = (new Messages.MsgWelcome([1,2,3], 'message')).serialize()
                let fromBuffer = Messages.MsgWelcome.fromBuffer(buffer)
                let event = parser.messageToEvent('clientid', buffer)
                assert(event instanceof EventsOut.EventWelcome)
                assert.deepEqual(fromBuffer.serialize(), buffer)
                assert(fromBuffer.toEvent('clientid') instanceof EventsOut.EventWelcome)
                assert.deepEqual(fromBuffer.msg, 'message')
                assert.equal(fromBuffer.major, 1)
                assert.equal(fromBuffer.minor, 2)
                assert.equal(fromBuffer.patch, 3)
            });
        });

        /**
         * |00001
         */
        describe('Disconnect message', function () {
            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgDisconnect().serialize()
                let fromBuffer = Messages.MsgDisconnect.fromBuffer(buffer)
                let parsed = parser.messageToEvent('clientid', buffer)
                assert(parsed instanceof EventsOut.EventDisconnect)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent('clientid') instanceof EventsOut.EventDisconnect)
            });
        });

        describe('AuthValid message', function () {
            it('should serialize to Buffer', function () {
                let login = 'login1'
                let session = '109156be-c4fb-41ea-b1b4-efe1671c5836'
                let buffer = new Messages.MsgAuthValid(login, session).serialize()
                let fromBuffer = Messages.MsgAuthValid.fromBuffer(buffer)
                let parsed = parser.messageToEvent('clientid', buffer)
                assert(parsed instanceof EventsOut.EventAuthValid)
                assert.deepEqual(fromBuffer.serialize(), buffer)
                assert(fromBuffer.toEvent('clientid') instanceof EventsOut.EventAuthValid)

                let event = fromBuffer.toEvent('clientid')
                assert.deepEqual(event.login, login)
                assert.deepEqual(event.sessionId, session)
            });
        });

        describe('AuthInvalid message', function () {
            it('should serialize to Buffer', function () {
                let session = '109156be-c4fb-41ea-b1b4-efe1671c5836'
                let buffer = new Messages.MsgAuthInvalid(session).serialize()
                let fromBuffer = Messages.MsgAuthInvalid.fromBuffer(buffer)
                let parsed = parser.messageToEvent('clientid', buffer)
                assert(parsed instanceof EventsOut.EventAuthInvalid)
                assert.deepEqual(fromBuffer.serialize(), buffer)
                assert(fromBuffer.toEvent('clientid') instanceof EventsOut.EventAuthInvalid)
            });
        });
    })

    describe('Incoming messages', function () {

        var parser

        beforeEach(function() {
            parser = new MessageParser()
        })

        describe('MsgLogin', function () {
             it('should serialize to Buffer', function () {
                 let login = 'login1'
                 let pass = 'pass123'

                 let buffer = new Messages.MsgLogin(login, pass).serialize()
                 let fromBuffer = Messages.MsgLogin.fromBuffer(buffer)
                 let parsed = parser.messageToEvent('clientid', buffer)
                 assert(parsed instanceof Events.EventLogin)
                 assert.deepEqual(fromBuffer.serialize(), buffer)
                 assert(fromBuffer.toEvent('clientid') instanceof Events.EventLogin)
                 assert.deepEqual(fromBuffer.login, login)
                 assert.deepEqual(fromBuffer.pass, pass)
                 assert.deepEqual(parsed.login, login)
                 assert.deepEqual(parsed.pass, pass)
            });

        })

        /*
            [    xxxx      |  1     |  0   ]
               field id      cmd      user
         */
        describe('click field message', function () {
            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgClickField().serialize()
                let fromBuffer = Messages.MsgClickField.fromBuffer(buffer)
                let parsed = parser.messageToEvent('clientid', buffer)
                assert(parsed instanceof EventsLogic.EventClickField)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent('clientid') instanceof EventsLogic.EventClickField)
            });

        })

        /*
            [    xxx      |  001     |  0   ]
               view id       cmd      user
        */
        describe('change view message', function () {
             it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgChangeView().serialize()
                let fromBuffer = Messages.MsgChangeView.fromBuffer(buffer)
                let parsed = parser.messageToEvent('clientid', buffer)
                assert(parsed instanceof EventsLogic.EventChangeView)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent('clientid') instanceof EventsLogic.EventChangeView)
            });
        })

        /*
            [    xxxx     |  011    |  0   ]
               boost id       cmd      user
        */
        describe('activate boost message', function () {
             it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgActivateBoost().serialize()
                let fromBuffer = Messages.MsgActivateBoost.fromBuffer(buffer)
                let parsed = parser.messageToEvent('clientid', buffer)
                assert(parsed instanceof EventsLogic.EventActivateBoost)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent('clientid') instanceof EventsLogic.EventActivateBoost)
            });
        })

        /*
            [    xxxx     |  101    |  0   ]
               boost id       cmd      user
        */
        describe('buy boost message', function () {
            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgBuyBoost().serialize()
                let fromBuffer = Messages.MsgBuyBoost.fromBuffer(buffer)
                let parsed = parser.messageToEvent('clientid', buffer)
                assert(parsed instanceof EventsIn.EventBuyBoost)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent('clientid') instanceof EventsIn.EventBuyBoost)
            });
        })

        /*
            [    xxxx     |  111    |  0   ]
               how many      cmd      user
        */
        describe('buy gems message', function () {
               it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgBuyGems().serialize()
                let fromBuffer = Messages.MsgBuyGems.fromBuffer(buffer)
                let parsed = parser.messageToEvent('clientid', buffer)
                assert(parsed instanceof EventsIn.EventBuyGems)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent('clientid') instanceof EventsIn.EventBuyGems)
            });
        })
    })


})

