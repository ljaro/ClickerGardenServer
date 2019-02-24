const assert = require('assert');
const net = require('net');
const sinon = require("sinon");

const CryptoChecker = require("../../../infra/utils/crypto_checker").CryptoChecker;
const crypto = require('crypto');

describe('CryptoChecker', function () {

    let cryptoChecker;

    beforeEach(function () {
        cryptoChecker = new CryptoChecker();
    })

    it('should test P"=dbP" P"=slow(S||P`) P`=slow(site||userid||P) P=pass', async function () {

        let clientPass = 'pass1';
        let clientLogin = 'login1';
        let site = 'site';

        let clientHash = crypto.scryptSync(clientPass, clientLogin + site, 64);


        let serverSalt = crypto.randomBytes(64);
        let dbPass = crypto.scryptSync(clientHash, serverSalt, 64);

        let result = await cryptoChecker.compare(dbPass, clientHash, serverSalt)

        assert(result)
    });

    it('should not accept strange parameters', async function () {

        let clientPass = 'pass1';
        let clientLogin = 'login1';
        let site = 'site1';

        let clientHash = crypto.scryptSync(clientPass, clientLogin + site, 64);


        let serverSalt = crypto.randomBytes(64);
        let dbPass = crypto.scryptSync(clientHash, serverSalt, 64);

        let result = await cryptoChecker.compare(dbPass+'1', clientHash, serverSalt)

        assert(!result)
    });

});