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


});