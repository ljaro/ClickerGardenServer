const assert = require('assert');
const net = require('net');
const sinon = require("sinon");

const UnPacker = require("../../../infra/network/unpacker").UnPacker
const c2s = require("../../../infra/network/messages/client2server_pb");
const s2c = require("../../../infra/network/messages/server2client_pb");
const msgTypes = require("../../../infra/network/messages/message_types")


describe('UnPacker', function () {

    let unpacker;

    beforeEach(function () {
        unpacker = new UnPacker();
    })

    afterEach(function () {

    })

    it('should handle null or undefined payload', function () {
        let result = unpacker.unpackMessage(null);
        assert.equal(undefined);

        result = unpacker.unpackMessage();
        assert.equal(undefined);

        result = unpacker.unpackMessage(1);
        assert.equal(undefined);
    })

    it('should unpack message to event', function () {

        let msg = new s2c.DisconnectReq();
        msg.setStatus(s2c.DisconnectReq.Status.SERVER_ABOUT_TO_CLOSE);

        let part1 = Buffer.from([msgTypes.SERVER_DISCONNECT_REQ]);
        let part2 = Buffer.from(msg.serializeBinary());

        let payload = Buffer.concat([part1, part2])

        let result = unpacker.unpackMessage(payload);

        assert.deepEqual(result, {id: 2, group: 'any', msg: {status: 0}});
    });

    it('should unpack no message when payload size is 0', function () {
        let msg = new s2c.DisconnectReq();
        msg.setStatus(s2c.DisconnectReq.Status.SERVER_ABOUT_TO_CLOSE);

        let part1 = Buffer.from([msgTypes.SERVER_DISCONNECT_REQ]);
        let part2 = Buffer.from(msg.serializeBinary());

        let payload = Buffer.concat([part1, part2])

        let result = unpacker.unpackMessage(Buffer.from([]));

        assert.deepEqual(result, undefined);
    });

    it('should create message from id', function () {
        let msg = unpacker.createMessage(100);
        assert(msg instanceof c2s.LoginRequest);
    });

    it('should create message and unpack', function () {
        const event1 = {id: 100, group: 'any', msg: {login: '', pass: ''}};
        let t = msgTypes.getTypeById(event1.id);
        let msg = new t()
        const message = unpacker.createMessage(event1)
        const packed = unpacker.packMessage(message)
        const event2 = unpacker.unpackMessage(packed)

        assert.deepEqual(event2, event1);
    });

});