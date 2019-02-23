'use strict';

const uuidv4 = require('uuid/v4');
const Hasher = require("../infra/utils/hasher").Hasher
const EventHandler = require("../infra/core/event_handler").EventHandler

class Auth extends EventHandler {

    handleEvent(event) {

    }

    getGroup () {
       return 'all'
    }
}


exports.Auth = Auth;