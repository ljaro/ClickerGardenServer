'use strict';

const EventsIn = require("../network/events").EventsIn
const EventsOut = require("../network/events").EventsOut

class MessageParser  {

    constructor() {

    }

    messageToEvent(buffer) {
        let msg = this.parse(buffer)
        let result = msg.toEvent()
        return result
    }

    //private

    /**
     * creates InboundMessage from Buffer
     * @param {buffer} buffer - incoming message Buffer
     * @return InboundMessage
     */
    parse(buffer) {
        if(buffer.length <= 0)
            return null

        let hd = buffer.readUInt8(0)
        let user = (hd & 0x1) >> 0
        let cmd = (hd & 0x2) >> 1

        if(user === 0) {

            if (cmd === 0) {
                return MsgClickField.fromBuffer(buffer)
            }
            else {
                let cmd = (hd & 0xE) >> 1

                switch (cmd) {
                    case 1:
                        return MsgChangeView.fromBuffer(buffer)
                    case 3:
                        return MsgActivateBoost.fromBuffer(buffer)
                    case 5:
                        return MsgBuyBoost.fromBuffer(buffer)
                    case 7:
                        return MsgBuyGems.fromBuffer(buffer)
                }

                return null
            }
        } else if (user === 1) {
            let cmd = (hd & 0x6e) >> 1
            switch (cmd) {
                case 1:
                    return MsgDisconnect.fromBuffer(buffer)
                case 2:
                    return MsgWelcome.fromBuffer(buffer)
            }
        } else {
            return null
        }
    }
}

class OutboundMessage {

    /**
     * creates Event from Message
     * @return Event
     */
    toEvent() {
    }

    serialize() {
    }
}

class InboundMessage {

    /**
     * creates Event from Message
     * @return Event
     */
    toEvent() {
    }

    serialize() {
    }
}

class MsgDisconnect extends OutboundMessage {
    constructor() {
        super()
    }

    static fromBuffer(buffer) {
        let b1 = buffer.readUInt8(0)
        let serverCmd = (b1 & 0x3E) >> 1

        if(serverCmd === 1)
        {
            return new MsgDisconnect()
        }

        return null
    }

    toEvent() {
        return new EventsOut.EventDisconnect()
    }

    serialize() {
        let userCmd = 1
        let serverCmd = 1

        let b = 0
        b |= (serverCmd << 1)
        b |= (userCmd << 0)

        return Buffer.from([b])
    }
}

class MsgBuyGems extends InboundMessage {
    constructor(count) {
        super()
        this.count = count
    }

    static fromBuffer(buffer) {
        let b1 = buffer.readUInt8(0)
        let user = (b1 & 0x1) >> 0
        let cmd = (b1 & 0xE) >> 1
        let boostId = (b1 & 0xF0) >> 4

        if(user === 0 && cmd === 7)
        {
            return new MsgBuyGems(boostId)
        }

        return null
    }

    toEvent() {
        return new EventsIn.EventBuyGems(this.count)
    }

    serialize() {
        let boostId = this.count
        let userCmd = 0
        let cmdType = 7

        let b = 0
        b |= (boostId << 4)
        b |= (cmdType << 1)
        b |= (userCmd << 0)

        return Buffer.from([b])
    }

}

class MsgBuyBoost extends InboundMessage {
    constructor(boostId) {
        super()
        this.boostId = boostId
    }

    static fromBuffer(buffer) {
        let b1 = buffer.readUInt8(0)
        let user = (b1 & 0x1) >> 0
        let cmd = (b1 & 0xE) >> 1
        let boostId = (b1 & 0xF0) >> 4

        if(user === 0 && cmd === 5)
        {
            return new MsgBuyBoost(boostId)
        }

        return null
    }

    toEvent() {
        return new EventsIn.EventBuyBoost(this.boostId)
    }

    serialize() {
        let boostId = this.boostId
        let userCmd = 0
        let cmdType = 5

        let b = 0
        b |= (boostId << 4)
        b |= (cmdType << 1)
        b |= (userCmd << 0)

        return Buffer.from([b])
    }
}

class MsgActivateBoost extends InboundMessage {
    constructor(boostId) {
        super()
        this.boostId = boostId
    }

    static fromBuffer(buffer) {
        let b1 = buffer.readUInt8(0)
        let user = (b1 & 0x1) >> 0
        let cmd = (b1 & 0xE) >> 1
        let boostId = (b1 & 0xF0) >> 4

        if(user === 0 && cmd === 3)
        {
            return new MsgActivateBoost(boostId)
        }

        return null
    }

    toEvent() {
        return new EventsIn.EventActivateBoost(this.boostId)
    }

    serialize() {
        let boostId = this.boostId
        let userCmd = 0
        let cmdType = 3

        let b = 0
        b |= (boostId << 4)
        b |= (cmdType << 1)
        b |= (userCmd << 0)

        return Buffer.from([b])
    }
}

class MsgChangeView extends InboundMessage {
    constructor(viewId) {
        super()
        this.viewId = viewId
    }

    static fromBuffer(buffer) {
        let b1 = buffer.readUInt8(0)
        let user = (b1 & 0x1) >> 0
        let cmd = (b1 & 0xE) >> 1
        let viewId = (b1 & 0x70) >> 4

        if(user === 0 && cmd === 1)
        {
            return new MsgChangeView(viewId)
        }

        return null
    }

    toEvent() {
        return new EventsIn.EventChangeView(this.viewId)
    }

    serialize() {
        let viewId = this.viewId
        let userCmd = 0
        let cmdType = 1

        let b = 0
        b |= (viewId << 4)
        b |= (cmdType << 1)
        b |= (userCmd << 0)

        return Buffer.from([b])
    }
}

class MsgClickField extends InboundMessage {
    constructor(fieldId) {
        super()
    }

    static fromBuffer(buffer) {
        let b1 = buffer.readUInt8(0)
        let user = (b1 & 0x1) >> 0
        let cmd = (b1 & 0x2) >> 1
        let id = (b1 & 0x3c) >> 2

        if(user === 0 && cmd === 0)
        {
            return new MsgClickField(id)
        }
        else
        {
            return null
        }
    }

    toEvent() {
        return new EventsIn.EventClickField(this.fieldId)
    }

    serialize() {
        let fieldId = this.fieldId
        let userCmd = 0
        let cmdType = 0

        let b = 0
        b |= (fieldId << 2)
        b |= (cmdType << 1)
        b |= (userCmd << 0)

        return Buffer.from([b])
    }
}

class MsgWelcome extends OutboundMessage {

    /**
     * Represents a book.
     * @constructor
     * @param {array} version - [major, minor, patch]
     * @param {string} message - Plain text message
     */
    constructor(version, message) {
        super()
        this.major = parseInt(version[0])
        this.minor = parseInt(version[1])
        this.patch = parseInt(version[2])
        this.msg = message.substring(0, 500)
    }

    static fromBuffer(buffer) {
        let b1 = buffer.readUInt8(0)
        let user = (b1 & 0x1) >> 0
        let cmd = (b1 & 0x6f) >> 1
        let major = buffer.readUInt8(1)
        let minor = buffer.readUInt8(2)
        let patch = buffer.readUInt8(3)
        let buffmsg = Buffer.allocUnsafe(500).fill(0);
        let message = buffer.copy(buffmsg, 4, 500).toString()

        if(user === 1 && cmd === 2)
        {
            return new MsgWelcome([major, minor, patch], message)
        }
        else
        {
            return null
        }
    }

    toEvent() {
        return new EventsOut.EventWelcome()
    }

    serialize() {
        let userCmd = 1
        let serverCmd = 2
        let major = this.major
        let minor = this.minor
        let patch = this.patch
        let msg = this.msg.slice(0, 500-1)

        let b = 0
        b |= (serverCmd << 1)
        b |= (userCmd << 0)

        return Buffer.from([b, major, minor, patch, msg])
    }
}


exports.MessageParser = MessageParser
exports.Messages = {
    MsgActivateBoost: MsgActivateBoost,
    MsgChangeView: MsgChangeView,
    MsgClickField: MsgClickField,
    MsgWelcome: MsgWelcome,
    MsgBuyBoost: MsgBuyBoost,
    MsgBuyGems: MsgBuyGems,
    MsgDisconnect: MsgDisconnect
}