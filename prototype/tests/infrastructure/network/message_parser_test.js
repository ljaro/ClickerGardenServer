const assert = require('assert');
const net = require('net');
const sinon = require("sinon");
const MessageParser = require("../../../infrastructure/network/message_parser").MessageParser
const Messages = require("../../../infrastructure/network/message_parser").Messages
const EventsIn = require("../../../infrastructure/network/events").EventsIn
const EventsOut = require("../../../infrastructure/network/events").EventsOut

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
                assert(buffer.length <= 500 + 3)
            })

            it('should be parsed as EventWelcome', function () {
                let dir = 1 // 0 incoming 1 outgoing
                let cmd = 2
                let major = 255
                let minor = 255
                let patch = 255
                let msg = new Array(501 + 1).join('A');

                let b = 0
                b |= (cmd << 1)
                b |= (dir << 0)

                let buff = Buffer.from([b, major, minor, patch, msg])
                let event = parser.messageToEvent(buff)
                assert(event instanceof EventsOut.EventWelcome)
            });

            it('should serialize to Buffer', function () {
                let buffer = (new Messages.MsgWelcome([1,2,3], 'message')).serialize()
                let fromBuffer = Messages.MsgWelcome.fromBuffer(buffer)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsOut.EventWelcome)
            });
        });

        /**
         * |00001
         */
        describe('Disconnect message', function () {
            it('should be parsed as EventDisconnect', function () {
                let dir = 1
                let cmd = 1

                let b = 0
                b |= (cmd << 1)
                b |= (dir << 0)

                let buff = Buffer.from([b])
                let event = parser.messageToEvent(buff)
                assert(event instanceof EventsOut.EventDisconnect)
            });

            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgDisconnect().serialize()
                let fromBuffer = Messages.MsgDisconnect.fromBuffer(buffer)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsOut.EventDisconnect)
            });
        });
    })

    describe('Incoming messages', function () {

        var parser

        beforeEach(function() {
            parser = new MessageParser()
        })

        describe('login message', function () {
            it('should be parsed as EventLogin', function () {
                let fieldId = 15
                let dir = 0
                let cmd = 0

                let b = 0
                b |= (fieldId << 2)
                b |= (cmd << 1)
                b |= (dir << 0)

                let buff = Buffer.from([b])
                let event = parser.messageToEvent(buff)
                assert(event instanceof EventsIn.EventClickField)
            });

            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgClickField().serialize()
                let fromBuffer = Messages.MsgClickField.fromBuffer(buffer)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsIn.EventClickField)
            });

        })

        /*
            [    xxxx      |  1     |  0   ]
               field id      cmd      user
         */
        describe('click field message', function () {
            it('should be parsed as EventClickField', function () {
                let fieldId = 15
                let dir = 0
                let cmd = 0

                let b = 0
                b |= (fieldId << 2)
                b |= (cmd << 1)
                b |= (dir << 0)

                let buff = Buffer.from([b])
                let event = parser.messageToEvent(buff)
                assert(event instanceof EventsIn.EventClickField)
            });

            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgClickField().serialize()
                let fromBuffer = Messages.MsgClickField.fromBuffer(buffer)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsIn.EventClickField)
            });

        })

        /*
            [    xxx      |  001     |  0   ]
               view id       cmd      user
        */
        describe('change view message', function () {
            it('should be parsed as EventChangeView', function () {
                let viewId = 1
                let dir = 0
                let cmd = 1

                let b = 0
                b |= (viewId << 4)
                b |= (cmd << 1)
                b |= (dir << 0)

                let buff = Buffer.from([b])
                let event = parser.messageToEvent(buff)
                assert(event instanceof EventsIn.EventChangeView)
            });

            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgChangeView().serialize()
                let fromBuffer = Messages.MsgChangeView.fromBuffer(buffer)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsIn.EventChangeView)
            });
        })

        /*
            [    xxxx     |  011    |  0   ]
               boost id       cmd      user
        */
        describe('activate boost message', function () {
            it('should be parsed as EventActivateBoost', function () {
                let boostId = 1
                let dir = 0
                let cmd = 3

                let b = 0
                b |= (boostId << 4)
                b |= (cmd << 1)
                b |= (dir << 0)

                let buff = Buffer.from([b])
                let event = parser.messageToEvent(buff)
                assert(event instanceof EventsIn.EventActivateBoost)
            });

            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgActivateBoost().serialize()
                let fromBuffer = Messages.MsgActivateBoost.fromBuffer(buffer)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsIn.EventActivateBoost)
            });
        })

        /*
            [    xxxx     |  101    |  0   ]
               boost id       cmd      user
        */
        describe('buy boost message', function () {
            it('should be parsed as EventBuyBoost', function () {
                let boostId = 1
                let dir = 0
                let cmd = 5

                let b = 0
                b |= (boostId << 4)
                b |= (cmd << 1)
                b |= (dir << 0)

                let buff = Buffer.from([b])
                let event = parser.messageToEvent(buff)
                assert(event instanceof EventsIn.EventBuyBoost)
            });

            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgBuyBoost().serialize()
                let fromBuffer = Messages.MsgBuyBoost.fromBuffer(buffer)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsIn.EventBuyBoost)
            });
        })

        /*
            [    xxxx     |  111    |  0   ]
               how many      cmd      user
        */
        describe('buy gems message', function () {
            it('should be parsed as EventBuyGems', function () {
                let boostId = 1
                let dir = 0
                let cmd = 7

                let b = 0
                b |= (boostId << 4)
                b |= (cmd << 1)
                b |= (dir << 0)

                let buff = Buffer.from([b])
                let event = parser.messageToEvent(buff)
                assert(event instanceof EventsIn.EventBuyGems)
            });

            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgBuyGems().serialize()
                let fromBuffer = Messages.MsgBuyGems.fromBuffer(buffer)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsIn.EventBuyGems)
            });
        })
    })


})

