const assert = require('assert');
const net = require('net');
const uuidv4 = require('uuid/v4');

const sinon = require("sinon");
const Auth = require("../../../infrastructure/network/auth").Auth
const Events = require("../../../infrastructure/network/events").Events
const EventEmitter = require('events').EventEmitter;
const Hasher = require("../../../infrastructure/network/hasher").Hasher

describe('Auth', function () {

    var auth
    var dispatcher
    var hasher
    var db

    beforeEach(function () {
        dispatcher = new EventEmitter()
        hasher = new Hasher()
        db = {'queryUserAuthData': function(){}}
        auth = new Auth(dispatcher, hasher, db)
    })

    after(function () {
    })


    it('should register to dispatcher for EventLogin', function () {
        let mock = sinon.mock(dispatcher)
        mock.expects('on').once()
        new Auth(dispatcher)
        mock.verify()
    });

    it('should emit EventAuthValid if password and login valid', function (done) {
        this.timeout = 100
        let testPass = 'pass1'
        let hashedTestPass = '9238408238402834'
        let testLogin = 'login1'
        let testSession = '329402934-239482394-9238492384'

        sinon.stub(auth, 'userHashedPassword').returns(hashedTestPass)
        sinon.stub(hasher, 'compare').withArgs(hashedTestPass, testPass).resolves(true)
        sinon.stub(auth, 'generateSessionId').returns(testSession)

        dispatcher.on('authValid', function (login, session) {
            assert.equal(login, testLogin)
            assert.equal(session, testSession)
            done()
        })

        dispatcher.emit('login', testLogin, testPass)

    });

    it('should emit EventAuthInvalid if password and login is not valid', function (done) {
        this.timeout = 100
        let testPass = 'pass1'
        let hashedTestPass = '9238408238402834'
        let testLogin = 'login1'

        sinon.stub(auth, 'userHashedPassword').returns(hashedTestPass)
        sinon.stub(hasher, 'compare').withArgs(hashedTestPass, testPass).resolves(false)

        dispatcher.on('authInvalid', function () {
            done()
        })

        dispatcher.emit('login', testLogin, testPass)

    });

    it('should query user data with login [pass, salt]', function (done) {
        let testPass = 'pass1'
        let testLogin = 'login1'

        sinon.stub(db, 'queryUserAuthData').returns([testPass])
        sinon.stub(hasher, 'compare').resolves(true)

        dispatcher.on('authValid', function () {
            done()
        })

        dispatcher.emit('login', testLogin, testPass)
    });

    it('should should generate long session id', function () {
        let uuid = uuidv4().toString().length
        let id = auth.generateSessionId()

        assert.notEqual(uuid, 0, 'error in test case - sha256 length must be non zero')
        assert(id.length >= uuid)
    });

})

