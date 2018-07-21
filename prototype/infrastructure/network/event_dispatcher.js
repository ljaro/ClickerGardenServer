'use strict';
const EventEmitter = require('events');

class EventDispatcher  extends EventEmitter {

    constructor() {
        super()
    }

    dispatch(msg) {
        this.emit(msg.name())
    }
}

exports.EventDispatcher = EventDispatcher