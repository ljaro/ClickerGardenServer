const assert = require('assert');

const net = require('net');

const sinon = require("sinon");
var fp = require("find-free-port")


const server = require('../infra/server').server;

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

    it('should 1', async function () {
        let client = await clientConnect({port: server.port()});
        client.on('data',async (data)=>{
            console.log('data ' + data)

            await send(client, Buffer.from([1,2,3]))
            await disconnect(client)
        });
    });
});