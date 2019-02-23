'use strict';



class HashMaker {
    constructor() {
        if (this.hash === undefined) {
            throw new TypeError("Must override method");
        }
    }
}


const bcrypt = require('bcrypt');

class HashBCrypt extends HashMaker {
    constructor() {
        super()
    }

    hash(pass) {

    }

    compare(hash, expectedHash) {
        return bcrypt.compare(hash, expectedHash)
    }
}

exports.Hasher = HashBCrypt