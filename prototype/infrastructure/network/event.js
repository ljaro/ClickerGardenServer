'use strict';

/**
 * Event
 * Event with recipient (socket/client id) as first parameter
 */
class Event {
    constructor(clientId) {
        this.clientId = clientId
    }

    name() {
        let className = this.constructor.name.replace('Event', '')
        return className.charAt(0).toLowerCase() + className.slice(1);
    }

    emit(emitter) {
        emitter.emit(this.name(), this.clientId)
    }
}

exports.Event = Event
