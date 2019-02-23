const assert = require('assert');
const net = require('net');
const sinon = require("sinon");
var fp = require("find-free-port")

const ConnectionHandler = require("../../../infra/network/connection_handler").ConnectionHandler
const Dispatcher = require("../../../infra/network/dispatcher").Dispatcher
const ChunkProcessor = require("../../../infra/network/chunk_processor").ChunkProcessor


describe('ChunkProcessor', function () {

    var store;

    beforeEach(function () {
        store = {};
        ChunkProcessor.initProcessChunk(store);
    })

    afterEach(function () {
    })


    function processChunk(chunks, callback) {
        for (let i = 0; i < chunks.length; i++) {
            ChunkProcessor.processChunk(store, chunks[i], callback);
        }
    }

    it('should respect buffer limit', function (done) {
        let chunk = [Buffer.alloc(100000)];
        chunk[0][0] = 100; // first byte is size of payload
        processChunk(chunk, (buff) => {
            assert.deepEqual(buff, Buffer.alloc(100));
            done();
        });
    })

    it('should process 0 size chunk followed by message', function (done) {
        processChunk([Buffer.from([0]), Buffer.from([2]), Buffer.from([5]), Buffer.from([6])], (buff) => {
            assert.deepEqual(buff, Buffer.from([5, 6]));
            done();
        });
    });

    it('should process middle chunk empty before another message', function (done) {

        let chunks = [Buffer.from([2]), Buffer.from([5, 6]), Buffer.from([]), Buffer.from([2]), Buffer.from([7, 8])];
        let results = [];
        let expect = [Buffer.from([5, 6]), Buffer.from([7, 8])];

        processChunk(chunks, function (buff) {
            results.push(buff);
            if (results.length === 2) {
                for (let i = 0; i < expect.length; i++) {
                    assert.deepEqual(expect[i], results[i]);
                }
                done();
            }
        });
    });

    it('should process middle chunk empty after size', function (done) {
        processChunk([Buffer.from([2]), Buffer.from([]), Buffer.from([5]), Buffer.from([6])], (buff) => {
            assert.deepEqual(buff, Buffer.from([5, 6]));
            done();
        });
    });

    it('should process middle chunk empty two messages', function (done) {
        let chunks = [Buffer.from([2]), Buffer.from([]), Buffer.from([5, 6]), Buffer.from([2]), Buffer.from([7, 8])]
        let results = [];
        let expect = [Buffer.from([5, 6]), Buffer.from([7, 8])];

        processChunk(chunks, function (buff) {
            results.push(buff);
            if (results.length === 2) {
                for (let i = 0; i < expect.length; i++) {
                    assert.deepEqual(expect[i], results[i]);
                }
                done();
            }
        });
    });

    it('should process middle chunk empty after data chunk', function (done) {
        processChunk([Buffer.from([2]), Buffer.from([5]), Buffer.from([]), Buffer.from([6])], (buff) => {
            assert.deepEqual(buff, Buffer.from([5, 6]));
            done();
        });
    });

    it('should process middle chunk empty after size', function (done) {
        processChunk([Buffer.from([2]), Buffer.from([]), Buffer.from([5]), Buffer.from([6])], (buff) => {
            assert.deepEqual(buff, Buffer.from([5, 6]));
            done();
        });
    });

    it('should process first chunk empty', function (done) {
        processChunk([Buffer.from([]), Buffer.from([2, 5, 6])], (buff) => {
            assert.deepEqual(buff, Buffer.from([5, 6]));
            done();
        });
    });

    it('should process message in one chunk', function (done) {
        processChunk([Buffer.from([2, 5, 6])], (buff) => {
            assert.deepEqual(buff, Buffer.from([5, 6]));
            done();
        });
    });

    it('should process message in 2 chunks', function (done) {
        const chunks = [Buffer.from([2, 5]), Buffer.from([6])];
        processChunk(chunks, (buff) => {
            assert.deepEqual(buff, Buffer.from([5, 6]));
            done();
        });
    });

    it('should process message in 3 chunks', function (done) {
        const chunks = [Buffer.from([3, 10]), Buffer.from([20]), Buffer.from([30])];
        processChunk(chunks, (buff) => {
            assert.deepEqual(buff, Buffer.from([10, 20, 30]));
            done();
        });
    });

    it('should process one chunk with two messages', function (done) {
        const chunks = [Buffer.from([2, 10, 20, 2, 30, 40])];

        let results = [];
        let expect = [Buffer.from([10, 20], Buffer.from([30, 40]))];

        processChunk(chunks, function (buff) {
            results.push(buff);
            if (results.length === 2) {
                for (let i = 0; i < expect.length; i++) {
                    assert.deepEqual(expect[i], results[i]);
                }
                done();
            }
        });
    });

    it('should process first message in 2 chunks, but second chunk has another message', function (done) {
        const chunks = [
            Buffer.from([2, 10]),
            Buffer.from([20, 2, 30, 40])];

        let results = [];
        let expect = [Buffer.from([10, 20]), Buffer.from([30, 40])];

        processChunk(chunks, function (buff) {
            results.push(buff);
            if (results.length === 2) {
                for (let i = 0; i < expect.length; i++) {
                    assert.deepEqual(expect[i], results[i]);
                }
                done();
            }
        });
    });


})
