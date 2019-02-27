
const c2s = require('./client2server_pb')
const s2c = require('./server2client_pb')


const TEST_MESSAGE = 1;
const SERVER_DISCONNECT_REQ = 2;
const CLIENT_LOGIN_REQ = 100;

exports.TEST_MESSAGE = TEST_MESSAGE;
exports.SERVER_DISCONNECT_REQ = SERVER_DISCONNECT_REQ;
exports.CLIENT_LOGIN_REQ = CLIENT_LOGIN_REQ;



const msgs = {
    [TEST_MESSAGE]: s2c.TestNonEmptyMessage,
    [SERVER_DISCONNECT_REQ]: s2c.DisconnectReq,
    [CLIENT_LOGIN_REQ]: c2s.LoginRequest
}

function createTypesToId(msgs) {
    let res = new Map();
    Object.keys(msgs).forEach(k => {
        res.set(msgs[k], k)
    })

    return res;
}

function createIdToTypes(msgs) {
    let res = new Map();
    Object.keys(msgs).forEach(k => {
        res.set(k, msgs[k])
    })

    return res;
}

const types_to_id = createTypesToId(msgs);
const id_to_types = createIdToTypes(msgs);

exports.getTypeById = function (id) {
    return id_to_types.get(id.toString())
}

exports.getIdByType = function (type) {
    if(type.prototype)
        return types_to_id.get(type)
    else
        return types_to_id.get(type.constructor)
}
