'use strict';

const uuidv4 = require('uuid/v4');
const Hasher = require("./hasher").Hasher
const EventsOut = require("./events").EventsOut


class Auth {

    static create(dispatcher, db) {
        return new Auth(dispatcher, new Hasher(), db)
    }

    constructor(dispatcher, hasher, db) {
        this.hasher = hasher
        this.dispatcher = dispatcher
        this.db = db
        dispatcher.on('login', this.handleLogin.bind(this))
    }

    handleLogin(clientId, login, pass) {

        console.log('handling login: ' + login)

        let self = this
        let hash = this.userHashedPassword(login)

        this.hasher.compare(hash, pass).then(function (result) {
            if(result) {
                let event = new EventsOut.EventAuthValid(clientId, login, self.generateSessionId())
                self.dispatcher.dispatch(event)
            } else {
                let event = new EventsOut.EventAuthInvalid(clientId)
                self.dispatcher.dispatch(event)
            }
        }).catch(function (reason) {
            let event = new EventsOut.EventAuthInvalid(clientId)
            self.dispatcher.dispatch(event)
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