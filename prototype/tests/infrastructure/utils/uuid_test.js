const assert = require('assert');
const sinon = require("sinon");
const Uuid = require("../../../infrastructure/utils/uuid").Uuid


describe('Uuid', function () {


    it('should create uuid string', function () {
        let id = Uuid.genString()
        assert(typeof id === "string")
        assert.equal(id.length, (16*2 + 4))
    });

    it('should create uuid buffer', function () {
        let id = Uuid.genBuffer()
        assert(id instanceof Buffer)
        assert.equal(id.length, 16)
    });

    it('should create uuid array', function () {
        let id = Uuid.genArray()
        assert(id instanceof Array)
        assert.equal(id.length, 16)
    });

    it('should strToBuffer', function () {
        let id = Uuid.genString()
        let arr = Uuid.strToArray(id)
        let str = Uuid.arrayToStr(arr)
        let arr2 = Uuid.strToArray(str)

        assert.equal(str, id)
        assert.deepEqual(arr2, arr)
        assert.equal(arr.length, 16)
    });
})

