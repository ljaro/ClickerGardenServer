'use strict';

const net = require('net');
const EventEmitter = require('events');

class Client extends EventEmitter {

    constructor(portt){
        super()
        this.client = net.createConnection({port: portt}, this.onConnected.bind(this))
    }

    onConnected() {
        this.emit('connected', this.client)
    }

    stop() {
        this.client.destroy()
    }
}

exports.Client = Client