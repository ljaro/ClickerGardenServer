'use strict';
const Event = require("../../infrastructure/network/event").Event

class EventLogic extends Event
{
    constructor() {
        super()
    }
}

/**
 * EventPlayerConnected
 * (logic)
 * inbound
 * when player connected
 */
class EventPlayerConnected extends  EventLogic {
    constructor() {
        super()
    }
}

/**
 * EventActivateBoost
 * (logic)
 * inbound
 * player action routed to game logic
 */
class EventActivateBoost extends EventLogic {
    constructor(boostId){
        super()
        this.boostId = boostId
    }

    emit(emitter) {
        emitter.emit(this.name(), this.boostId)
    }
}

/**
 * EventChangeView
 * (logic)
 * inbound
 * player wants to change view by swipe
 */
class EventChangeView extends EventLogic {
    constructor(viewId){
        super()
        this.viewId = viewId
    }

    emit(emitter) {
        emitter.emit(this.name(), this.viewId)
    }
}

/**
 * EventClickField
 * (logic)
 * inbound
 * player click game object i.e field, dog, plant, tree
 */
class EventClickField extends EventLogic {
    constructor(fieldId){
        super()
        this.fieldId = fieldId
    }

    emit(emitter) {
        emitter.emit(this.name(), this.fieldId)
    }
}



exports.EventsLogic = {
    EventClickField: EventClickField,
    EventChangeView: EventChangeView,
    EventActivateBoost: EventActivateBoost,
    EventPlayerConnected: EventPlayerConnected,
}