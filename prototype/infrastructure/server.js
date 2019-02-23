'use strict';
const Database = require("./database/database").Database
const Auth = require("./network/auth").Auth
const EventDispatcher = require("./network/event_dispatcher").EventDispatcher
const MessageParser = require("./network/message_parser").MessageParser
const Events = require("./network/events").Events
const MsgWelcome = require("./network/message_parser").MsgWelcome
const ConnectionListener = require("./network/listener").ConnectionListener
const GameLogic = require("../game/logic/logic").GameLogic

class Server {
    constructor() {
        this.dispatcher = new EventDispatcher()
        this.logic = new GameLogic()
        this.db = new Database()
        this.auth = Auth.create(this.dispatcher, this.db)
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