'use strict';
const EventEmitter = require('events');

class EventDispatcher  extends EventEmitter {

    constructor() {
        super()
    }

    dispatch(event) {
        if(!event) {
            throw new Error('Undefined event')
        }
        event.emit(this)
    }

    onPlayerConnected(cb) {
        this.on('playerConnected', cb)
    }
    onPlayerCloseSocket(cb) {
        this.on('playerCloseSocket', cb)
    }
    onPlayerAboutToCloseSocket(cb) {
        this.on('playerAboutToCloseSocket', cb)
    }
    onClickField(cb) {
        this.on('clickField', cb)
    }
    onChangeView(cb) {
        this.on('changeView', cb)
    }
    onActivateBoost(cb) {
        this.on('activateBoost', cb)
    }
    onBuyBoost(cb) {
        this.on('buyBoost', cb)
    }
    onBuyGems(cb) {
        this.on('buyGems', cb)
    }
    onLogin(cb) {
        this.on('login', cb)
    }
    onDisconnect(cb) {
        this.on('disconnect', cb)
    }
    onWelcome(cb) {
        this.on('welcome', cb)
    }
    onAuthValid(cb) {
        this.on('authValid', cb)
    }
    onAuthInvalid(cb) {
        this.on('authInvalid', cb)
    }
}

exports.EventDispatcher = EventDispatcher