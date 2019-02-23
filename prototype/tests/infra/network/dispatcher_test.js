const assert = require('assert');
const net = require('net');
const sinon = require("sinon");
var fp = require("find-free-port")

const TcpServer = require("../../../infra/network/tcp_server").TcpServer
const ConnectionHandler = require("../../../infra/network/connection_handler").ConnectionHandler
const c2s = require("../../../infra/network/messages/client2server_pb");
const s2c = require("../../../infra/network/messages/server2client_pb");
const msgTypes = require("../../../infra/network/messages/message_types")
const Dispatcher = require("../../../infra/network/dispatcher").Dispatcher

describe('Dispatcher', function () {
    let dispatcher;
    let emitter;
    let unPacker;

    beforeEach(function () {
        emitter = {dispatch: function(){}};
        unPacker = { unpackMessage: function(){}};
        dispatcher = new Dispatcher(emitter, unPacker);
    })

    afterEach(function () {

    })

    async function createClient() {
        return new Promise(resolve => {
            const client = net.createConnection({ port: 8125 }, async () => {
                resolve(client);
            });
        });
    }

    it('should disconnect all sockets on closeToAll call', function () {
        let msg = new s2c.DisconnectReq();
        msg.setStatus(s2c.DisconnectReq.Status.SERVER_ABOUT_TO_CLOSE);
        let buff = Buffer.from(msg.serializeBinary());
        let data = Buffer.from([Buffer.from([buff.length + 1, msgTypes.SERVER_DISCONNECT_REQ]), buff]);

        let mocks = [];

        for(let i = 0; i< 100; i++) {
            let s = new net.Socket({});
            let mock = sinon.mock(s);
            mock.expects('write').withArgs(data);
            mock.expects('end').once();
            mocks.push(mock);
            dispatcher.sockets.push(s);
        }

        dispatcher.closeToAll();

        mocks.forEach(x=>x.verify());
    });

    it('should remove socket after disconnect', async function () {

        const s = net.createServer((c) => {
            dispatcher.sockets.push(c);
        });

        s.listen(8125, () => {})


        let c1 = await createClient();
        let c2 = await createClient();
        let c3 = await createClient();

        assert.equal(dispatcher.sockets.length, 3);

        await dispatcher.closeToAll();

        assert.equal(dispatcher.sockets.length, 0);

        c1.end();
        c2.end();
        c3.end();

        s.close();
    });

    it('should registerSocket, unpackMessage, createEvent, dispatch after consume', function () {
        let socket = {}
        let message = {}
        dispatcher.registerSocket = sinon.spy();
        dispatcher.unpackMessage = sinon.spy();
        dispatcher.createEvent = sinon.spy();
        dispatcher.dispatch = sinon.spy();

        dispatcher.consume(socket, message);

        sinon.assert.callOrder(
            dispatcher.registerSocket,
            dispatcher.unpackMessage,
            dispatcher.dispatch
        )
    });

    it('should forward unpack to UnPacker', function () {
        unPacker.unpackMessage = sinon.spy();
        dispatcher.unpackMessage({});

        assert(unPacker.unpackMessage.called);
    });

    it('should forward dispatch to emitter', function () {
        emitter.dispatch = sinon.spy();
        dispatcher.dispatch({});

        assert(emitter.dispatch.called);
    });
});