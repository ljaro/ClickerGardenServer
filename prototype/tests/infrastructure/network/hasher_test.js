const assert = require('assert');
const net = require('net');
const sinon = require("sinon");

const Hasher = require("../../../infrastructure/network/hasher").Hasher
const bcrypt = require('bcrypt');


describe('Hasher', function () {

    var hasher

    beforeEach(function () {
        hasher = new Hasher()
    })

    after(function () {
    })

    it('should compare hashes', function (done) {
        let salt = bcrypt.genSaltSync(10);
        let pass = 'password1'
        let dbHash = bcrypt.hashSync(pass, salt);

        hasher.compare(pass, dbHash).then((res)=>{
            assert(res)
            done()
        }).catch((err)=>{
            done(err)
        })

    });

})

