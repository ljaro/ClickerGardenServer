const assert = require('assert');
const net = require('net');
const sinon = require("sinon");
var fp = require("find-free-port")

const TcpServer = require("../../../infra/network/tcp_server").TcpServer
const ConnectionHandler = require("../../../infra/network/connection_handler").ConnectionHandler
const Dispatcher = require("../../../infra/network/dispatcher").Dispatcher

describe('ConnectionHandler', function () {

    var handler;
    var dispatcher = new Dispatcher()

    beforeEach(function () {
        handler = new ConnectionHandler(dispatcher);
    })

    afterEach(function () {
    })

    describe('forward to dispatcher', function () {
        it('should dispatch message', function (done) {
            let socket = new net.Socket({});
            let mock = sinon.mock(dispatcher)
            mock.expects('consume').withArgs(socket, Buffer.from([1])).once();
            let stub = sinon.stub(socket, 'write')
            handler.onPlayerConnected(socket);
            socket.emit('data', Buffer.from([1,1]))

            mock.verify()
            done();
        });


        it('should dispatch message to one socket', function (done) {
            let socket1 = new net.Socket({});
            let socket2 = new net.Socket({});

            let mock = sinon.mock(dispatcher)
            mock.expects('consume').withArgs(socket1, Buffer.from([1])).once();
            mock.expects('consume').withArgs(socket2, Buffer.from([2])).once();

            let stub1 = sinon.stub(socket1, 'write')
            let stub2 = sinon.stub(socket2, 'write')

            handler.onPlayerConnected(socket1);
            handler.onPlayerConnected(socket2);

            socket1.emit('data', Buffer.from([1,1]))
            socket2.emit('data', Buffer.from([1,2]))

            mock.verify()
            done();
        });
    })

    describe('closing', function () {
        it('should forward close to dispatcher', function () {
            let mock = sinon.mock(dispatcher);
            mock.expects('closeToAll').once();

            handler.close();
            return mock.verify();
        });
    });

})
