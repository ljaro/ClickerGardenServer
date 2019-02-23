'use strict';
const TcpServer = require('./network/tcp_server').TcpServer;
const ConnectionHandler = require('./network/connection_handler').ConnectionHandler;
const Dispatcher = require('./network/dispatcher').Dispatcher;
const UnPacker = require('./network/unpacker').UnPacker;
const EventsDispatcher = require('./core/events_dispatcher').EventsDispatcher;
const Auth = require('../auth/auth').Auth;

let auth = new Auth();
let eventsDispatcher = new EventsDispatcher();
eventsDispatcher.registerListener(auth)

let unPacker = new UnPacker();
let dispatcher = new Dispatcher(eventsDispatcher, unPacker);
let connHandler = new ConnectionHandler(dispatcher);
let server = new TcpServer('127.0.0.1', 3333, connHandler, function () {
    console.log('listener')
});

exports.server = server;