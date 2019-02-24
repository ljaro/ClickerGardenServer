'use strict';

class EventHandler {

    constructor() {
        this.emitters = new Set();
    }

    handleEvent(event) {
        throw new TypeError("Must override method");
    }

    dispatch(event) {
        this.emitters.forEach(x => x.dispatch(event));
    }

    addEmitter(emitter) {
        this.emitters.add(emitter);
    }

    delEmitter(emitter) {
        this.emitters.delete(emitter);
    }
}

exports.EventHandler = EventHandler;