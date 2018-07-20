'use strict';
const EventDispatcher = require("./network/event_dispatcher").EventDispatcher
const MessageParser = require("./network/message_parser").MessageParser
const Events = require("./network/events").Events
const MsgWelcome = require("./network/message_parser").MsgWelcome
const ConnectionListener = require("./network/listener").ConnectionListener
const GameLogic = require("./logic/logic").GameLogic

class Server {
    constructor() {
        this.dispatcher = new EventDispatcher()
        this.logic = new GameLogic()
        this.parser = new MessageParser()
        this.listener = new ConnectionListener(this.parser, this.dispatcher)
    }

    start() {
        this.listener.start()
    }

    stop() {
        this.listener.stop()
    }

    port() {
        return this.listener.port()
    }
}


exports.Server = Server