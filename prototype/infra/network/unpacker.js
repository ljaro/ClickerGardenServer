'use strict';
let net = require('net');
const c2s = require("./messages/client2server_pb");
const s2c = require("./messages/server2client_pb");
const msgTypes = require("./messages/message_types")

class UnPacker {

    unpackMessage(payload) {
        if(!payload)
            return;

        if(payload.length < 1) // byte for type
            return;

        const type = payload[0];

        let result;

        switch (type) {
            case msgTypes.SERVER_DISCONNECT_REQ:
                result = s2c.DisconnectReq.deserializeBinary(payload.slice(1));
        }

        return this.createEvent(type, result);
    }

    createEvent(id, message) {
        if(message && id) {
            let obj = message.toObject();
            let event = {
                id: id,
                group: 'any',
                msg: obj
            }
            return event
        } else {
            return {id: 500, msg: {}}
        }
    }
}

exports.UnPacker = UnPacker;