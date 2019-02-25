'use strict';

const uuidv4 = require('uuid/v4');
const CryptoChecker = require("../infra/utils/crypto_checker").CryptoChecker
const EventHandler = require("../infra/core/event_handler").EventHandler
const assert = require('assert');

class Auth extends EventHandler {

    constructor(hasher) {
        super();
        this.hasher = hasher;
    }

    async handleEvent(event) {
        assert(this instanceof Auth, 'this must be Auth type')

        const userLogin = event.msg.login;
        const userPass  = event.msg.password;

        if(!userLogin || !userPass) {
            this.dispatch({id: 502, group: 'auth', session: undefined, details: 11});
            return;
        }

        const jobs = async () => {
            const userCred = await this.getUserCredInfo(userLogin);
            if(!(userCred && userCred.pass && userCred.salt) ) {
                this.dispatch({id: 502, group: 'auth', session: undefined, details: 10});
                return;
            }

            const result = await this.hasher.compare(
                userCred.pass,
                userPass,
                userCred.salt);

            if(result) {
                const session = await this.generateSessionId();
                this.dispatch({id: 501, group: 'auth', session: session});
            } else {
                this.dispatch({id: 502, group: 'auth', session: undefined});
            }
        }

        return await jobs();
    }

    getGroup () {
       return 'any'
    }

    async getUserCredInfo(login) {

    }

    async generateSessionId() {
        return uuidv4().toString()
    }
}


exports.Auth = Auth;