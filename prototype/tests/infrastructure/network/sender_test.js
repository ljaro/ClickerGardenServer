const assert = require('assert');
const net = require('net');
const sinon = require("sinon");


describe('Sender', function () {

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




})

