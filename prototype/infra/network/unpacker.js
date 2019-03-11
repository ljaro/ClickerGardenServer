'use strict';
let net = require('net');
const c2s = require("./messages/client2server_pb");
const s2c = require("./messages/server2client_pb");
const msgTypes = require("./messages/message_types")

class UnPacker {

    unpackMessage(payload) {
        if(!payload)
            return;

        if(!Buffer.isBuffer(payload))
            return;

        if(payload.length < 1) // byte for type
            return;

        const type = +payload[0];

        let result;

        const msg = payload.slice(2)

        switch (type) {
            case msgTypes.SERVER_DISCONNECT_REQ:
                result = s2c.DisconnectReq.deserializeBinary(msg);
                break;
            case msgTypes.CLIENT_LOGIN_REQ:
                result = c2s.LoginRequest.deserializeBinary(msg);
                break;
            default:
                return null;
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

    createMessage(event) {
        if(Number.isInteger(event)) {
            var t = event;
        } else {
            var t = event.id;
        }

        let tp = msgTypes.getTypeById(t);
        if(tp) {
            var msg = new tp();
        }
        return msg;
    }

    getType(message) {
        switch (message)
        {
            case 0:
                break;
        }
    }

    packMessage(message) {
        const payload = message.serializeBinary();
        const type = +msgTypes.getIdByType(message)
        const size = payload.length + 1

        const header = Buffer.from([type, size])
        return Buffer.concat([header, Buffer.from(payload)])
    }
}

exports.UnPacker = UnPacker;