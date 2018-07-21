'use strict';
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');

class Auth {
    constructor(dispatcher, hasher, db) {
        this.hasher = hasher
        this.dispatcher = dispatcher
        this.db = db
        dispatcher.on('login', this.handleLogin.bind(this))
    }

    handleLogin(login, pass) {
        let self = this
        let hash = this.userHashedPassword(login)

        this.hasher.compare(hash, pass).then(function (result) {
            if(result) {
                self.dispatcher.emit('authValid', login, self.generateSessionId())
            } else {
                self.dispatcher.emit('authInvalid', login)
            }
        }).catch(function () {
            self.dispatcher.emit('authInvalid', login)
        })
    }

    userHashedPassword(login) {
        return this.db.queryUserAuthData(login)
    }

    generateSessionId() {
        return uuidv4().toString()
    }
}

exports.Auth = Auth


/*
https://www.tarsnap.com/scrypt/scrypt.pdf
https://stackoverflow.com/questions/13275187/are-there-any-slow-javascript-hashing-algorithms-like-bcrypt
 */