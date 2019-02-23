const assert = require('assert');
const net = require('net');
const sinon = require("sinon");
var fp = require("find-free-port")

const TcpServer = require("../../../infra/network/tcp_server").TcpServer
const ConnectionHandler = require("../../../infra/network/connection_handler").ConnectionHandler
const c2s = require("../../../infra/network/messages/client2server_pb");
const s2c = require("../../../infra/network/messages/server2client_pb");
const msgTypes = require("../../../infra/network/messages/message_types")

describe('TcpServer', function () {

    var server;
    var connHandler;
    var dispatcher = {
        consume: function(){},
        closeToAll: function () {}
    };
    var port = 1333;

    beforeEach(function (done) {

        fp(5000, function(err, freePort){
            port = freePort;
            connHandler = new ConnectionHandler(dispatcher);
            server = new TcpServer('127.0.0.1', port, connHandler, done);
            server.start();
        });
    })

    afterEach(function (done) {
        server.stop(done)
    })

    it('should listen on port after start', function (done) {
        let client = net.connect({port: port}, function () {
            client.end();
            done();
        })
    });

    it('should forward disconnect request to connectionHandler', function () {
        let mock = sinon.mock(connHandler);
        mock.expects('close').once();

        server.stop();
        server.stop = function(done){done()}
        return mock.verify();
    });

    // it('should send disconnect request to clients on close', function (done) {
    //     let client = net.connect({port: port}, function () {
    //
    //         client.on('data', function (data) {
    //             const type = data[1];
    //             const payload = data.slice(1)
    //             let msg = s2c.DisconnectReq.deserializeBinary(payload);
    //
    //             assert.equal(msg.getStatus(), s2c.DisconnectReq.Status.SERVER_ABOUT_TO_CLOSE);
    //             assert.equal(type, msgTypes.SERVER_DISCONNECT_REQ);
    //         })
    //
    //         server.stop(function () {
    //             done();
    //         })
    //     })
    // })

})
