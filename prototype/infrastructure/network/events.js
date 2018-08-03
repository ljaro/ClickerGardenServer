'use strict';

class Event {

    constructor() {

    }

    name() {
        let className = this.constructor.name.replace('Event', '')
        return className.charAt(0).toLowerCase() + className.slice(1);
    }

    emit(emitter) {
        emitter.emit(this.name())
    }
}

class EventPlayerConnected extends  Event {
    constructor() {
        super()
    }
}

class EventBuyGems extends  Event {
    constructor(count){
        super()
        this.count = count
    }

    emit(emitter) {
        emitter.emit(this.name(), this.count)
    }
}

class EventBuyBoost extends  Event {
    constructor(boostId){
        super()
        this.boostId = boostId
    }

    emit(emitter) {
        emitter.emit(this.name(), this.boostId)
    }
}

class EventActivateBoost extends Event {
    constructor(boostId){
        super()
        this.boostId = boostId
    }

    emit(emitter) {
        emitter.emit(this.name(), this.boostId)
    }
}

class EventChangeView extends Event {
    constructor(viewId){
        super()
        this.viewId = viewId
    }

    emit(emitter) {
        emitter.emit(this.name(), this.viewId)
    }
}

class EventClickField extends Event {
    constructor(fieldId){
        super()
        this.fieldId = fieldId
    }

    emit(emitter) {
        emitter.emit(this.name(), this.fieldId)
    }
}

class EventPlayerCloseSocket extends Event {
    constructor(){
        super()
    }
}

class EventPlayerAboutToCloseSocket extends Event {
    constructor(){
        super()
    }
}

class EventDisconnect extends Event {
    constructor() {
        super()
    }
}

class EventWelcome extends Event {
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

class EventLogin extends Event {
    constructor(login, pass) {
        super()
        this.login = login
        this.pass = pass
    }

    emit(emitter) {
        emitter.emit(this.name(), this.login, this.pass)
    }
}

class EventAuthValid extends  Event {
    constructor(sessionId) {
        super()
        this.sessionId = sessionId
    }

    emit(emitter) {
        emitter.emit(this.name(), this.sessionId)
    }
}

class EventAuthInvalid extends  Event {
    constructor() {
        super()
    }
}

exports.EventsIn = {
    EventPlayerCloseSocket: EventPlayerCloseSocket,
    EventPlayerAboutToCloseSocket: EventPlayerAboutToCloseSocket,
    EventClickField: EventClickField,
    EventChangeView: EventChangeView,
    EventActivateBoost: EventActivateBoost,
    EventBuyBoost: EventBuyBoost,
    EventBuyGems: EventBuyGems,
    EventPlayerConnected: EventPlayerConnected
}

exports.Events = {
    EventLogin: EventLogin
}

exports.EventsOut = {
    EventDisconnect: EventDisconnect,
    EventWelcome: EventWelcome,
    EventAuthValid: EventAuthValid,
    EventAuthInvalid: EventAuthInvalid
}

