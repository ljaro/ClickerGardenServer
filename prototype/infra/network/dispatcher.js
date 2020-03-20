'use strict';
let net = require('net');
const s2c = require("./messages/server2client_pb");
const msgTypes = require("./messages/message_types")

class Dispatcher {
    constructor(emitter, unpacker) {
        this.sockets = [];
        this.unpacker = unpacker;
        this.emitter = emitter;
    }

    consume(socket, payload) {
        let event = this.unpackMessage(payload);
        this.dispatch(event);
    }

    registerSocket(socket) {

    }

    unpackMessage(payload) {
        return this.unpacker.unpackMessage(payload);
    }

    dispatch(event) {
        this.emitter.dispatch(event);
    }

    async closeToAll() {

        let msg = new s2c.DisconnectReq();
        msg.setStatus(s2c.DisconnectReq.Status.SERVER_ABOUT_TO_CLOSE);
        let buff = Buffer.from(msg.serializeBinary());
        let data = Buffer.from([Buffer.from([buff.length + 1, msgTypes.SERVER_DISCONNECT_REQ]), buff]);

        const resp = this.sockets.map(x=>{
            return new Promise(resolve => {
                x.write(data);
                x.end(data, 'utf8', () => {
                    const idx = this.sockets.indexOf(x);
                    if (idx > -1) this.sockets.splice(idx, 1);
                    resolve();
                });
            });
        });

        return Promise.all(resp);
    }
}

exports.Dispatcher = Dispatcher
