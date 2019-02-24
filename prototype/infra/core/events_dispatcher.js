'use strict';
const net = require('net');
const EventEmitter = require('events');

class EventsDispatcher {
    constructor() {
        this.emitter = new EventEmitter();
    }

    registerListener(listener) {
        if(!listener) {
            throw new TypeError("Listener must be defined");
        }

        if(!listener.getGroup) {
            throw new TypeError("Listener must implement getGroup method");
        }

        if(!listener.handleEvent) {
            throw new TypeError("Listener must implement handleEvent");
        }

        const group = listener.getGroup();
        if(Array.isArray(group)) {
            group.forEach((group) => this.emitter.on(group, listener.handleEvent));
        } else {
            this.emitter.on(group, listener.handleEvent);
        }

        listener.addEmitter(this);
    }

    dispatch(event) {
        this.emitter.emit(event.group, event);
    }
}


exports.EventsDispatcher = EventsDispatcher;