'use strict';

const uuidv4 = require('uuid/v4');
const uuidParse = require('uuid-parse');

class Uuid {

    constructor(){

    }

    static genString() {
        return uuidv4()
    }

    static genBuffer() {
        let buff = Buffer.alloc(16)
        uuidv4(null, buff)
        return buff
    }

    static genArray() {
        let buff = new Array()
        uuidv4(null, buff)
        return buff
    }

    static strToArray(str) {
        let bytes = uuidParse.parse(str)
        return bytes;
    }

    static arrayToStr(arr) {
        let str = uuidParse.unparse(arr)
        return str
    }
}

exports.Uuid = Uuid