'use strict';
const net = require('net');
const EventEmitter = require('events');

class EventsDispatcher {
    constructor() {
        this.emitter = new EventEmitter();
    }

    registerListener(listener) {
        this.emitter.on(listener.getGroup(), listener.handleEvent);
    }

    dispatch(event) {
        this.emitter.emit(event.group, event);
    }
}


exports.EventsDispatcher = EventsDispatcher;