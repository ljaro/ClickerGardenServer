let net = require('net');
let util = require('util')
let Tile = require('./tile_sm/tile').Tile

let playersTokens = {}

function chop(str, char) {
    if(!char) char = '\n'
    return str.endsWith(char) && str.slice(0, str.length - 1)
}

function handleLogin(socket, params) {
    let login = chop(params[0])
    let token = login

    console.log('player logged in ""' + login + '""')

    playersTokens[token] = {
        'login': login,
        'remoteAddress': socket.remoteAddress,
        'auth': true,
        'token': token,
        'socket': socket,
        'coins': 10,
        'gems': 5,
        'plants': ['carrot', 'ccc'],
        'tiles': [
            {
                state: 1
            },
            {
                state: 1
            }
        ]
    }

    socket.write(token)
}

function queryGems(socket, player) {
    return socket.write("" + player['gems'])
}

function queryCoins(socket, player) {
    return socket.write("" + player['coins'])
}

function queryPlants(socket, player) {
    let plants = JSON.stringify(player['plants'])
    return socket.write(plants)
}

function queryTiles(socket, player) {

    let data = ''
    player.tiles.forEach(function (tile, i) {
        let d = ''+i+':'+tile.state
        data += d + ','
    })

    data = chop(data, ',')

    return socket.write(data)
}

function fieldClick(socket, params) {
    let fieldIdx = chop(params[2])
}

function handleAction(socket, params) {
    let token = params[0]
    let cmd = chop(params[1])
    let player = playersTokens[token]
    f (!player) {
        socket.write('not such player ' + token + '\n')
    }


    let act = {
        'fclick': fieldClick,
    }

    if (act[cmd]) {
        act[cmd](socket, player)
    } else {
        socket.write('command ""' + cmd + '"" not found.\n')
    }
}

function handleQuery(socket, params) {
    let token = params[0]
    let cmd = chop(params[1])
    let player = playersTokens[token]
    if (!player) {
        socket.write('not such player ' + token + '\n')
    }

    let act = {
        'gems': queryGems,
        'coins': queryCoins,
        'plants': queryPlants,
        'tiles': queryTiles
    }

    if (act[cmd]) {
        act[cmd](socket, player)
    } else {
        socket.write('command ""' + cmd + '"" not found.\n')
    }
}

function handleIncomingMsg(socket, data) {
    let str = data.toString()
    let d = str.split(':')

    let cmd = d[0]
    let params = d.slice(1)

    let act = {
        'login': handleLogin,
        'l': handleLogin,

        'query': handleQuery,
        'q': handleQuery,

        'action': handleAction,
        'a': handleAction
    }

    if (act[cmd]) act[cmd](socket, params)
}

function onPlayerConnected(socket) {

    socket.write('Connected to server\r\n');

    socket.on('data', function (rec) {
        console.log(util.inspect(rec))
        handleIncomingMsg(socket, rec)
    })

    socket.on('end', function () {
        console.log('#end')
    })

    socket.on('close', function () {
    })
}

class GameServer {

    constructor() {
        this.tcpSrv = net.createServer(onPlayerConnected);
    }

    start() {
        this.tcpSrv.listen(1337, '127.0.0.1');
    }

    broadcastMessage(msg) {
        for(let token in playersTokens) {
            if(playersTokens.hasOwnProperty(token)) {
                let player = playersTokens[token]
                player['socket'].write(msg)
            }
        }
    }

}

exports.GameServer = GameServer


