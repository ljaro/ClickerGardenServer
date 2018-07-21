'use strict';

class Event {

    constructor() {

    }

    name() {
        let className = this.constructor.name.replace('Event', '')
        return className.charAt(0).toLowerCase() + className.slice(1);
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
}

class EventBuyBoost extends  Event {
    constructor(boostId){
        super()
        this.boostId = boostId
    }
}

class EventActivateBoost extends Event {
    constructor(boostId){
        super()
        this.boostId = boostId
    }
}

class EventChangeView extends Event {
    constructor(viewId){
        super()
        this.viewId = viewId
    }
}

class EventClickField extends Event {
    constructor(fieldId){
        super()
        this.fieldId = fieldId
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
    constructor() {
        super()
    }
}

class EventLogin extends Event {
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
    EventWelcome: EventWelcome
}