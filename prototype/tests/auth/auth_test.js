const assert = require('assert');
const net = require('net');
const sinon = require("sinon");

const Auth = require("../../auth/auth").Auth;
const CryptoChecker = require("../../infra/utils/crypto_checker").CryptoChecker;
const uuidv4 = require('uuid/v4');

describe('Auth', function () {

    let hasher;
    let db;
    let auth;

    beforeEach(function () {
        hasher = new CryptoChecker()
        db = {
            'queryUserAuthData': function () {
            }
        }
        auth = new Auth(hasher)
    })

    it('should emit EventAuthValid if password and login valid', async function () {
        let testPass = 'pass1'
        let hashedTestPass = '9238408238402834'
        let testLogin = 'login1'
        let testSession = '329402934-239482394-9238492384'

        sinon.stub(auth, 'getUserCredInfo').returns({pass:hashedTestPass, salt:'salt'})
        sinon.stub(auth, 'generateSessionId').returns(testSession)
        sinon.stub(hasher, 'compare').withArgs(hashedTestPass, testPass).resolves(true)

        let mock = sinon.mock(auth)
        mock.expects('dispatch').withArgs({id: 501, group: 'auth', session: testSession}).once()

        await auth.handleEvent({
            id: 111,
            group: 'any',
            msg: {
                login: testLogin,
                password: testPass
            }
        });

        mock.verify()
    });

    it('should invalidate if hashed pass from db is undefined', async function () {
        let testPass = 'pass1'
        let hashedTestPass = undefined
        let testLogin = 'login1'
        let testSession = '329402934-239482394-9238492384'

        sinon.stub(auth, 'getUserCredInfo').returns(undefined)
        sinon.stub(auth, 'generateSessionId').returns(testSession)
        sinon.stub(hasher, 'compare').withArgs(hashedTestPass, testPass).resolves(true)

        let mock = sinon.mock(auth)
        mock.expects('dispatch').withArgs({
            id: 502,
            group: 'auth',
            session: undefined,
            details: 10
        }).once()

        await auth.handleEvent({
            id: 111,
            group: 'any',
            msg: {
                login: testLogin,
                password: testPass
            }
        });

        mock.verify()
    });

    it('should invalidate if user login is undefined', async function () {
        let testPass = 'pass1'
        let hashedTestPass = undefined
        let testLogin = undefined
        let testSession = '329402934-239482394-9238492384'

        sinon.stub(auth, 'getUserCredInfo').returns('sadasdas')
        sinon.stub(auth, 'generateSessionId').returns(testSession)
        sinon.stub(hasher, 'compare').withArgs(hashedTestPass, testPass).resolves(true)

        let mock = sinon.mock(auth)
        mock.expects('dispatch').withArgs({
            id: 502,
            group: 'auth',
            session: undefined,
            details: 11
        }).once()

        await auth.handleEvent({
            id: 111,
            group: 'any',
            msg: {
                login: testLogin,
                password: testPass
            }
        });

        mock.verify()
    });

    it('should invalidate if user pass is undefined', async function () {
        let testPass = undefined
        let testLogin = 'login1'
        let testSession = '329402934-239482394-9238492384'

        sinon.stub(auth, 'getUserCredInfo').returns('sadasdas')
        sinon.stub(auth, 'generateSessionId').returns(testSession)
        sinon.stub(hasher, 'compare').resolves(true)

        let mock = sinon.mock(auth)
        mock.expects('dispatch').withArgs({
            id: 502,
            group: 'auth',
            session: undefined,
            details: 11
        }).once()

        await auth.handleEvent({
            id: 111,
            group: 'any',
            msg: {
                login: testLogin,
                password: testPass
            }
        });

        mock.verify()
    });

    it('should emit EventAuthInvalid if password and login is not valid', async function () {
        let testPass = 'pass1'
        let testLogin = 'login1'
        let hashedTestPass = '9238408238402834'

        sinon.stub(auth, 'getUserCredInfo').returns({pass:hashedTestPass, salt:'salt'})
        sinon.stub(hasher, 'compare').withArgs(hashedTestPass, testPass).resolves(false)

        let mock = sinon.mock(auth)
        mock.expects('dispatch').withArgs({id: 502, group: 'auth', session: undefined}).once()

        await auth.handleEvent({
            id: 111,
            group: 'any',
            msg: {
                login: testLogin,
                password: testPass
            }
        });

        mock.verify()
    });

    it('should generate long session id', async function () {
        let dbHash = 'xxxx'
        let dbSalt = 'salt'

        let event = {
            id: 111,
                group: 'any',
            msg: {
                login: 'login1',
                password: 'pass1'
            }
        }

        sinon.stub(hasher, 'compare').withArgs(dbHash, event.msg.password, dbSalt).resolves(true)
        sinon.stub(auth, 'getUserCredInfo').returns({pass:dbHash, salt:dbSalt})

        auth.dispatch = sinon.spy()

        await auth.handleEvent(event);

        const session = auth.dispatch.getCall(0).args[0].session;

        assert(session.length > 1);
        assert.notEqual(session, undefined);
    });

    it('should generate long session id2', async function () {
        let uuid = uuidv4().toString().length
        let id = await auth.generateSessionId()

        assert.notEqual(uuid, 0, 'error in test case - sha256 length must be non zero')
        assert.equal(id.length, uuid)
    });


});