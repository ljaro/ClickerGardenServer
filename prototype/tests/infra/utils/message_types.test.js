const assert = require('assert');
const net = require('net');
const sinon = require("sinon");

const msgTypes = require("../../../infra/network/messages/message_types");
const c2s = require("../../../infra/network/messages/client2server_pb");
const s2c = require("../../../infra/network/messages/server2client_pb");

describe('MessageTypes', function () {
    it('should return instance of LoginRequest', function () {
        const t = msgTypes.getTypeById(msgTypes.CLIENT_LOGIN_REQ);
        const tt = new t();
        assert(tt instanceof c2s.LoginRequest);
    });

    it('should return instance of LoginRequest 2', function () {
        const t = msgTypes.getTypeById(msgTypes.CLIENT_LOGIN_REQ.toString());
        const tt = new t();
        assert(tt instanceof c2s.LoginRequest);
    });

    it('should return id from message type', function () {
        const id = msgTypes.getIdByType(c2s.LoginRequest);
        assert.equal(id, msgTypes.CLIENT_LOGIN_REQ);
    });

    it('should return id from message instance', function () {
        const id = msgTypes.getIdByType(new c2s.LoginRequest());
        assert.equal(id, msgTypes.CLIENT_LOGIN_REQ);
    });
});
