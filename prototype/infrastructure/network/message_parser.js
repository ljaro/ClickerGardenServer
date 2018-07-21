'use strict';

const EventsIn = require("./events").EventsIn
const EventsOut = require("./events").EventsOut
const Events = require("./events").Events

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

        let cmd = buffer.readUInt8(0)

        switch (cmd)
        {
            case 0:
                return MsgClickField.fromBuffer(buffer)
            case 1:
                return MsgChangeView.fromBuffer(buffer)
            case 2:
                return MsgActivateBoost.fromBuffer(buffer)
            case 3:
                return MsgLogin.fromBuffer(buffer)
            case 4:
                return MsgBuyBoost.fromBuffer(buffer)
            case 5:
                return MsgBuyGems.fromBuffer(buffer)
            case 6:
                return MsgDisconnect.fromBuffer(buffer)
            case 7:
                return MsgWelcome.fromBuffer(buffer)
            default:
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
        let cmd = buffer.readUInt8(0)

        if(cmd === 6)
        {
            return new MsgDisconnect()
        }

        return null
    }

    toEvent() {
        return new EventsOut.EventDisconnect()
    }

    serialize() {
        let cmd = 6
        return Buffer.from([cmd])
    }
}

class MsgLogin extends  InboundMessage {
    constructor(login, pass) {
        super()
        this.login = login
        this.pass = pass
    }

    static fromBuffer(buffer) {
        let cmd = buffer.readUInt8(0)
        let login = buffer.toString('ascii', 1, 12)
        let pass = buffer.toString('ascii', 13, 16+25)

        if(cmd === 3)
        {
            return new MsgLogin(login, pass)
        }

        return null
    }

    toEvent() {
        return new Events.EventLogin()
    }

    serialize() {
        let cmd = 3
        let login = new Array(12).join('A');
        let pass = new Array(25).join('B');

        return Buffer.concat([Buffer.from([cmd]), Buffer.from(login), Buffer.from(pass)])
    }
}

class MsgBuyGems extends InboundMessage {
    constructor(count) {
        super()
        this.count = count
    }

    static fromBuffer(buffer) {
        let cmd = buffer.readUInt8(0)
        let boostId = buffer.readUInt8(1)

        if(cmd === 5)
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
        let cmd = 5
        return Buffer.from([cmd, boostId])
    }

}

class MsgBuyBoost extends InboundMessage {
    constructor(boostId) {
        super()
        this.boostId = boostId
    }

    static fromBuffer(buffer) {
        let cmd = buffer.readUInt8(0)
        let boostId = buffer.readUInt8(1)

        if(cmd === 4)
        {
            return new MsgBuyBoost(boostId)
        }

        return null
    }

    toEvent() {
        return new EventsIn.EventBuyBoost(this.boostId)
    }

    serialize() {
        let cmd = 4
        let boostId = this.boostId

        return Buffer.from([cmd, boostId])
    }
}

class MsgActivateBoost extends InboundMessage {
    constructor(boostId) {
        super()
        this.boostId = boostId
    }

    static fromBuffer(buffer) {
        let cmd = buffer.readUInt8(0)
        let boostId = buffer.readUInt8(1)

        if(cmd === 2)
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
        let cmd = 2
        return Buffer.from([cmd, boostId])
    }
}

class MsgChangeView extends InboundMessage {
    constructor(viewId) {
        super()
        this.viewId = viewId
    }

    static fromBuffer(buffer) {
        let cmd = buffer.readUInt8(0)
        let viewId = buffer.readUInt8(1)

        if(cmd === 1)
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
        let cmd = 1
        return Buffer.from([cmd, viewId])
    }
}

class MsgClickField extends InboundMessage {
    constructor(fieldId) {
        super()
    }

    static fromBuffer(buffer) {
        let cmd = buffer.readUInt8(0)
        let id = buffer.readUInt8(1)

        if(cmd === 0)
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
        let cmd = 0
        return Buffer.from([cmd, fieldId])
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
        let cmd = buffer.readUInt8(0)
        let major = buffer.readUInt8(1)
        let minor = buffer.readUInt8(2)
        let patch = buffer.readUInt8(3)
        let buffmsg = Buffer.allocUnsafe(500).fill(0);
        let message = buffer.copy(buffmsg, 4, 500).toString()

        if(cmd === 7)
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
        let cmd = 7
        let major = this.major
        let minor = this.minor
        let patch = this.patch
        let msg = this.msg.slice(0, 500-1)

        return Buffer.from([cmd, major, minor, patch, msg])
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
    MsgDisconnect: MsgDisconnect,
    MsgLogin: MsgLogin
}