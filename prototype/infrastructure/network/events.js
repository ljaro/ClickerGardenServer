'use strict';

const Event = require("./event").Event

/**
 * EventLogic
 * This type should be only used in logic module
 */

class EventCashier extends Event
{
    constructor(){
        super()
    }
}

class EventNetwork extends Event
{
    constructor(clientId){
        super(clientId)
    }
}

/**
 * EventBuyGems
 * (cashier)
 * player action routed to cashier (money stuff)
 */
class EventBuyGems extends  EventCashier {
    constructor(count){
        super()
        this.count = count
    }

    emit(emitter) {
        emitter.emit(this.name(), this.count)
    }
}

/**
 * EventBuyBoost
 * (cashier)
 * player action routed to cashier (money stuff)
 */
class EventBuyBoost extends  EventCashier {
    constructor(boostId){
        super()
        this.boostId = boostId
    }

    emit(emitter) {
        emitter.emit(this.name(), this.boostId)
    }
}

/**
 * EventPlayerCloseSocket
 * internal (network module)
 * player close the socket
 * should emit EventPlayerDisconnected to logic
 */
class EventPlayerCloseSocket extends Event {
    constructor(clientId){
        super(clientId)
    }
}

/**
 * EventPlayerAboutToCloseSocket
 * internal (network module)
 * player close the socket
 * should emit EventPlayerDisconnected to logic
 */
class EventPlayerAboutToCloseSocket extends Event {
    constructor(clientId){
        super(clientId)
    }
}

/**
 * EventWelcome
 * (network)
 * server->client
 * Sent after player connected
 * Because its send directly from listener's conn handler not need to have clientId
 */
class EventWelcome extends EventNetwork {
    constructor(major, minor, patch, msg) {
        super()
        this.major = major
        this.minor = minor
        this.patch = patch
        this.msg = msg
    }

    emit(emitter) {
        emitter.emit(this.name(), this.major, this.minor, this.patch, this.msg)
    }
}

/**
 * EventLogin
 * client->server
 * When player wants to login with name and pass
 */
class EventLogin extends EventNetwork {
    constructor(clientId, login, pass) {
        super()
        this.clientId = clientId
        this.login = login
        this.pass = pass
    }

    emit(emitter) {
        emitter.emit(this.name(), this.clientId, this.login, this.pass)
    }
}

/**
 * EventAuthValid
 * server->client
 */
class EventAuthValid extends  EventNetwork {
    constructor(clientId, login, sessionId) {
        super(clientId)
        this.sessionId = sessionId
        this.login = login
    }

    emit(emitter) {
        emitter.emit(this.name(), this.clientId, this.login, this.sessionId)
    }
}

/**
 * EventAuthInvalid
 * server->client
 */
class EventAuthInvalid extends  EventNetwork {
    constructor(clientId) {
        super(clientId)
    }
}

/**
 * EventDisconnect
 * (network)
 * outbound
 */
class EventDisconnect extends EventNetwork {
    constructor(clientId) {
        super()
        this.clientId = clientId
    }
}

exports.EventsIn = {
    EventPlayerCloseSocket: EventPlayerCloseSocket,
    EventPlayerAboutToCloseSocket: EventPlayerAboutToCloseSocket,
    EventBuyBoost: EventBuyBoost,
    EventBuyGems: EventBuyGems,
}

exports.Events = {
    EventLogin: EventLogin
}

exports.EventsOut = {
    EventWelcome: EventWelcome,
    EventAuthValid: EventAuthValid,
    EventAuthInvalid: EventAuthInvalid,
    EventDisconnect: EventDisconnect
}

