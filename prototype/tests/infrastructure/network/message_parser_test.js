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

            it('should serialize to Buffer', function () {
                let buffer = (new Messages.MsgWelcome([1,2,3], 'message')).serialize()
                let fromBuffer = Messages.MsgWelcome.fromBuffer(buffer)
                let parsed = parser.messageToEvent(buffer)
                assert(parsed instanceof EventsOut.EventWelcome)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsOut.EventWelcome)
            });
        });

        /**
         * |00001
         */
        describe('Disconnect message', function () {
            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgDisconnect().serialize()
                let fromBuffer = Messages.MsgDisconnect.fromBuffer(buffer)
                let parsed = parser.messageToEvent(buffer)
                assert(parsed instanceof EventsOut.EventDisconnect)
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

        // describe('login message', function () {
        //     it('should be parsed as EventLogin', function () {
        //         let dir = 0
        //         let cmd = 4
        //
        //         let b = 0
        //         b |= (cmd << 1)
        //         b |= (dir << 0)
        //
        //         let login = new Array(12).join('A');
        //         let pass = new Array(25).join('B');
        //
        //         let buff = Buffer.concat([Buffer.from([b]), Buffer.from(login), Buffer.from(pass)])
        //         let event = parser.messageToEvent(buff)
        //         assert(event instanceof EventsIn.EventLogin)
        //     });
        //
        //     it('should serialize to Buffer', function () {
        //         let buffer = new Messages.MsgLogin().serialize()
        //         let fromBuffer = Messages.MsgLogin.fromBuffer(buffer)
        //         assert(fromBuffer.serialize().equals(buffer))
        //         assert(fromBuffer.toEvent() instanceof EventsIn.EventLogin)
        //     });
        //
        // })

        /*
            [    xxxx      |  1     |  0   ]
               field id      cmd      user
         */
        describe('click field message', function () {
            it('should serialize to Buffer', function () {
                let buffer = new Messages.MsgClickField().serialize()
                let fromBuffer = Messages.MsgClickField.fromBuffer(buffer)
                let parsed = parser.messageToEvent(buffer)
                assert(parsed instanceof EventsIn.EventClickField)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsIn.EventClickField)
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
                let parsed = parser.messageToEvent(buffer)
                assert(parsed instanceof EventsIn.EventChangeView)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsIn.EventChangeView)
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
                let parsed = parser.messageToEvent(buffer)
                assert(parsed instanceof EventsIn.EventActivateBoost)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsIn.EventActivateBoost)
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
                let parsed = parser.messageToEvent(buffer)
                assert(parsed instanceof EventsIn.EventBuyBoost)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsIn.EventBuyBoost)
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
                let parsed = parser.messageToEvent(buffer)
                assert(parsed instanceof EventsIn.EventBuyGems)
                assert(fromBuffer.serialize().equals(buffer))
                assert(fromBuffer.toEvent() instanceof EventsIn.EventBuyGems)
            });
        })
    })


})

