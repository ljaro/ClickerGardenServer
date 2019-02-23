'use strict';
const uuidv4 = require('uuid/v4');
const EventsIn = require("./events").EventsIn
const EventsOut = require("./events").EventsOut
const Events = require("./events").Events
const EventsLogic = require("../../game/logic/events").EventsLogic
const Uuid = require("../utils/uuid").Uuid
class MessageParser  {

    constructor() {

    }

    readHeader(data) {
        let msg = MsgHeader.fromBuffer(data)
        return msg
    }

    //TODO nice but read twice
    removeHeader(data) {
        let msg = MsgHeader.fromBuffer(data)

        let dataSize = data.length - msg.headerSize
        let buff = Buffer.alloc(dataSize)
        data.copy(buff, 0, msg.headerSize, msg.headerSize+dataSize)
        return buff
    }

    messageToEvent(clientId, buffer) {
        if(clientId === undefined|| buffer === undefined)
            throw new Error("parameters doesn't match")

        let msg = this.parse(buffer)
        let result = msg.toEvent(clientId)

        if(!result) {
            throw new Error('Event was not created')
        }

        return result
    }

    //private

    /**
     * creates InboundMessage from Buffer
     * @param {buffer} buffer - incoming message Buffer
     * @return InboundMessage
     */
    parse(buffer) {

        let type = this.extractInstance(buffer)
        if(type)
            return type.fromBuffer(buffer)

        return null
    }

    isLogin(buffer) {
        if(buffer.length <= 0)
            return null

        let cmd = buffer.readUInt8(0)

        return cmd === 3
    }

    extractInstance(buffer) {
        if(buffer.length <= 0)
            return null

        let cmd = buffer.readUInt8(0)

        switch (cmd)
        {
            case 0:
                return MsgClickField
            case 1:
                return MsgChangeView
            case 2:
                return MsgActivateBoost
            case 3:
                return MsgLogin
            case 4:
                return MsgBuyBoost
            case 5:
                return MsgBuyGems
            case 6:
                return MsgDisconnect
            case 7:
                return MsgWelcome
            case 8:
                return MsgAuthValid
            case 9:
                return MsgAuthInvalid
            default:
                return null
        }
    }
}

class OutboundMessage {

    constructor() {
    }
    /**
     * creates Event from Message
     * @return Event
     */
    toEvent(clientId) {
        if(clientId === undefined) {
            throw Error('client id must be provided as first parameter')
        }
        return this.__toEvent(clientId)
    }

    __toEvent(clientId) {
        throw Error('implement this')
    }


    serialize() {
    }
}

class InboundMessage {

    constructor() {
    }

    /**
     * creates Event from Message
     * @return Event
     */
    toEvent(clientId) {
        if(clientId === undefined) {
            throw Error('client id must be provided as first parameter')
        }
        return this.__toEvent(clientId)
    }

    __toEvent(clientId) {
        throw Error('implement this')
    }

    serialize() {
    }
}

/**
 * If sessionStr is not provided then MsgHeader is dummy header
 */
//TODO make security tests
class MsgHeader extends InboundMessage {
    constructor(sessionStr) {
        super()
        this.sessionStr = sessionStr
    }

    static fromBuffer(buffer) {
        if(buffer.length > 1)
        {
            let msg = new MsgHeader()

            msg.headerSize = buffer.readUInt8(0)
            let sessionSize = msg.headerSize-1

            if(sessionSize > 0 && sessionSize <= buffer.length-1)
            {
                //TODO pack session to binary
                let buff = Buffer.alloc(sessionSize)
                buffer.copy(buff, 0, 1, 1+sessionSize)
                let sessionStr = Uuid.arrayToStr(buff)

                msg.sessionStr = sessionStr
            }
            else
            {
                // return msg without sessionstr
            }

            return msg
        }

        throw new Error('Cannot create message from buffer')
    }

    __toEvent(clientId) {
        throw new Error('__toEvent not implemented for MsgHeader')
    }

    serialize(payload) {

        if(this.sessionStr && payload)
        {
            let packetSession = Uuid.strToArray(this.sessionStr)
            let sessionBuffer = Buffer.from(packetSession)
            let size = Buffer.from([sessionBuffer.length+1])
            return Buffer.concat([size, sessionBuffer, payload])
        }
        else if(payload && !this.sessionStr)
        {
            let size = Buffer.from([1])
            return Buffer.concat([size, payload])
        }
        else if(!payload && this.sessionStr)
        {
            let size = Buffer.from([1])
            return Buffer.concat([size])
        }

        throw new Error('Case not implemented')
    }
}

/**
 * MsgDisconnect
 * Server force to disconnect client
 */
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

    __toEvent(clientId) {
        return new EventsOut.EventDisconnect(clientId)
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
        let loginLen = buffer.readUInt8(1)
        let login = buffer.toString('ascii', 2, 2+loginLen)

        let passLen = buffer.readUInt8(2 + loginLen)
        let pass = buffer.toString('ascii', 3+loginLen , 3+loginLen+passLen)

        if(cmd === 3)
        {
            return new MsgLogin(login, pass)
        }

        return null
    }

    __toEvent(clientId) {
        return new Events.EventLogin(clientId, this.login, this.pass)
    }

    serialize() {
        let cmd = 3
        let cmdBuff = Buffer.from([cmd])

        let login = this.login.slice(0, 12-1);
        let loginBuff = Buffer.from(login)
        let loginLen = Buffer.from([loginBuff.length])

        let pass = this.pass.slice(0, (16+25)-1);
        let passBuff = Buffer.from(pass)
        let passLen = Buffer.from([passBuff.length])

        return Buffer.concat([cmdBuff, loginLen, loginBuff, passLen, passBuff])
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

    __toEvent() {
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

    __toEvent() {
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

    __toEvent(clientId) {
        return new EventsLogic.EventActivateBoost(clientId, this.boostId)
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

    __toEvent(clientId) {
        return new EventsLogic.EventChangeView(clientId, this.viewId)
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
        this.fieldId = fieldId
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

    __toEvent(clientId) {
        return new EventsLogic.EventClickField(clientId, this.fieldId)
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

    //TODO non sense -  this is outbound message and not need to check validy:)
    static fromBuffer(buffer) {
        // first validity check

        if(!(buffer.length >= 4)) {
            return null
        }


        let cmd = buffer.readUInt8(0)
        let major = buffer.readUInt8(1)
        let minor = buffer.readUInt8(2)
        let patch = buffer.readUInt8(3)
        let messageLen = buffer.readUInt8(4)

        if(messageLen > (buffer.length - 4)) {
            return null
        }

        let message = buffer.toString('ascii', 5, 5 + messageLen)

        if(cmd === 7)
        {
            return new MsgWelcome([major, minor, patch], message)
        }
        else
        {
            return null
        }
    }

    __toEvent(clientId) {
        return new EventsOut.EventWelcome(clientId, this.major, this.minor, this.patch, this.msg)
    }

    serialize() {
        let cmd = 7
        let major = this.major
        let minor = this.minor
        let patch = this.patch
        let msg = Buffer.from(this.msg.slice(0, 255-1))
        let msgLen = msg.length

        return Buffer.concat([Buffer.from([cmd, major, minor, patch, msgLen]), msg])
    }
}

class MsgAuthValid extends OutboundMessage {
    constructor(login, sessionString) {
        super()
        this.sessionString = sessionString
        this.login = login
    }

    static fromBuffer(buffer) {
        let cmd = buffer.readUInt8(0)

        //TODO getting session len and fixed alloc(16) ?
        let sessionLen = buffer.readUInt8(1)

        let buff = Buffer.alloc(16)
        buffer.copy(buff, 0, 2, 2+sessionLen)
        let sessionStr = Uuid.arrayToStr(buff)

        let loginLen = buffer.readUInt8(2+sessionLen)
        let login = buffer.toString('ascii', 3 + sessionLen, 3 + sessionLen + loginLen)

        if(cmd === 8)
        {
            return new MsgAuthValid(login, sessionStr)
        }
        else
        {
            return null
        }
    }

    __toEvent(clientId) {
        return new EventsOut.EventAuthValid(clientId, this.login, this.sessionString)
    }

    serialize() {
        let cmd = 8
        let packetSession = Uuid.strToArray(this.sessionString)
        let sessionBuffer = Buffer.from(packetSession)
        let sessionLen = Buffer.from([sessionBuffer.length])

        let login = Buffer.from(this.login.slice(0, 12-1), 'utf8')
        let loginLen = Buffer.from([login.length])

        return Buffer.concat([Buffer.from([cmd]), sessionLen, sessionBuffer, loginLen, login])
    }
}

class MsgAuthInvalid extends OutboundMessage {
    constructor() {
        super()
    }

    static fromBuffer(buffer) {
        let cmd = buffer.readUInt8(0)

        if(cmd === 9)
        {
            return new MsgAuthInvalid()
        }
        else
        {
            return null
        }
    }

    __toEvent(clientId) {
        return new EventsOut.EventAuthInvalid(clientId)
    }

    serialize() {
        let cmd = 9
        return Buffer.from([cmd])
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
    MsgLogin: MsgLogin,
    MsgAuthValid: MsgAuthValid,
    MsgAuthInvalid: MsgAuthInvalid,
    MsgHeader: MsgHeader
}