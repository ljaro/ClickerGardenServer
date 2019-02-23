'use strict';

class EventHandler {
    handleEvent(event) {
        throw new TypeError("Must override method");
    }
}

exports.EventHandler = EventHandler;