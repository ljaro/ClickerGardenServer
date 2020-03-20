const assert = require('assert');

const net = require('net');
const c2s = require('../infra/network/messages/client2server_pb')
const sinon = require("sinon");
var fp = require("find-free-port")


const server = require('../infra/server').server;
const UnPacker = require('../infra/network/unpacker').UnPacker;

describe('Server', function () {


    beforeEach(function (done) {
        server.start(done)
    })

    afterEach(function (done) {
        server.stop(done)
    })

    async function clientConnect(where) {
        return new Promise(resolve => {
            let client = net.createConnection(where, function () {
                resolve(client)
            });
        });
    }

    async function disconnect(client) {
        return new Promise(resolve => {
            client.end(resolve);
        });
    }

    async function send(client, data) {
        return new Promise(resolve => {
            client.write(data, resolve)
        });
    }

    it('should login and get login status message', async function () {

        const loginReq = new c2s.LoginRequest();
        loginReq.setLogin('login1');
        loginReq.setPass('pass2');

        const unPacker = new UnPacker();
        const payload = unPacker.packMessage(loginReq);

        let client = await clientConnect({port: server.port()});
        await send(client, payload)

        client.on('data', async (data)=>{
            console.log('data ' + data)

            await send(client, Buffer.from([1,2,3]))
            await disconnect(client)
        });
    });
});