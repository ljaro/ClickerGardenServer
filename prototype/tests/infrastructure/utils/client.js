'use strict';

const net = require('net');
const EventEmitter = require('events');
const EventDispatcher = require("../../../infrastructure/network/event_dispatcher").EventDispatcher
const MessageParser = require("../../../infrastructure/network/message_parser").MessageParser

class Client extends EventEmitter {

    constructor(port, dispatcher) {
        super()
        this.port = port
        this.dispatcher = dispatcher
    }

    init() {
        this.client = net.createConnection({port: this.port}, this.onConnected.bind(this))
        this.client.on('data', this.onData.bind(this));
        this.parser = new MessageParser()
    }

    onConnected() {
        this.emit('connected', this.client)
    }

    onData(data) {
        let event = this.parser.messageToEvent(data)
        this.dispatcher.dispatch(event)
    }

    stop() {
        this.client.destroy()
    }
}

exports.Client = Client