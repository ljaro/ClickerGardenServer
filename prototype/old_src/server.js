let net = require('net');
let util = require('util')
const Player = require("./player").Player
let Tile = require('./tile_sm/tile').Tile

let playersDB = {
    "luk": {
        'login': 'luk',
        'coins': 10,
        'gems': 5,
        'plants': ['carrot', 'ccc'],
        'tiles': []
    },
    "ann": {
        'login': 'ann',
        'coins': 10,
        'gems': 5,
        'plants': ['carrot', 'ccc'],
        'tiles': []
    }
}

// at server start all players from db are loaded and assigned here
let players = {}

// logged in players
let activePlayers = {}

// as token is for logged in players this are players active but
// dict key: token, value: login
let playersToken = {}

// key:socket, value:login
let playersSocket = {}

function chop(str, char) {
    if (!char) char = '\n'
    return str.endsWith(char) && str.slice(0, str.length - 1)
}


class GameServer {

    constructor() {
        this.loadDB()
        this.tcpSrv = net.createServer(this.onPlayerConnected.bind(this) );
    }

    start() {
        this.tcpSrv.listen(1333, '127.0.0.1');
    }

    broadcastMessage(msg) {
        let activePlayers = this.getActivePlayers()
        for (let id in activePlayers) {
            if (activePlayers.hasOwnProperty(id)) {
                let player = activePlayers[id]
                player['socket'].write(msg)
            }
        }
    }

    getActivePlayers() {
        return activePlayers
    }

    loadDB() {
        for (let login in playersDB) {
            if (playersDB.hasOwnProperty(login)) {
                players[login] = Player.createFromDB(login)
                console.log('player loaded - ' + login)
            }
        }
    }

// todo create test
// todo handle re-login - old socket release and communicate
    handleLogin(socket, params) {
        let login = chop(params[0])

        if (login in players) {
            let token = login // new token generated
            playersToken[token] = login
            activePlayers[token] = {"token": token, "login": login}
            activePlayers[token]["socket"] = socket

            console.log('player logged in ""' + login + '""')
            socket.write(token)
        }
        else {
            socket.write('not such player ' + login + "\n")
        }
    }

    queryGems(socket, player) {
        return socket.write("" + player['gems'])
    }

    queryCoins(socket, player) {
        return socket.write("" + player['coins'])
    }

    queryPlants(socket, player) {
        let plants = JSON.stringify(player['plants'])
        return socket.write(plants)
    }

    queryTiles(socket, player) {

        let data = ''
        player.tiles.forEach(function (tile, i) {
            let d = '' + i + ':' + tile.state
            data += d + ','
        })

        data = chop(data, ',')

        return socket.write(data)
    }

    fieldClick(socket, params) {
        let fieldIdx = chop(params[2])
    }

    handleAction(socket, params) {
        let token = params[0]
        let cmd = chop(params[1])
        let player = players[token]
        if (!player) {
            socket.write('not such player ' + token + '\n')
        }

        let act = {
            'fclick': this.fieldClick,
        }

        if (act[cmd]) {
            act[cmd](socket, player)
        } else {
            socket.write('command ""' + cmd + '"" not found.\n')
        }
    }

    handleQuery(socket, params) {
        let token = params[0]
        let cmd = chop(params[1])
        let player = players[token]
        if (!player) {
            socket.write('not such player ' + token + '\n')
        }

        let act = {
            'gems': this.queryGems,
            'coins': this.queryCoins,
            'plants': this.queryPlants,
            'tiles': this.queryTiles
        }

        if (act[cmd]) {
            act[cmd](socket, player)
        } else {
            socket.write('command ""' + cmd + '"" not found.\n')
        }
    }

    handleIncomingMsg(socket, data) {
        let str = data.toString()
        let d = str.split(':')

        let cmd = d[0]
        let params = d.slice(1)

        let act = {
            'login': this.handleLogin,
            'l': this.handleLogin,

            'query': this.handleQuery,
            'q': this.handleQuery,

            'action': this.handleAction,
            'a': this.handleAction
        }

        if (act[cmd]) act[cmd](socket, params)
    }

    onPlayerConnected(socket) {
        var self = this
        socket.write('Connected to server\r\n');

        socket.on('data', function (rec) {
            console.log(util.inspect(rec))
            self.handleIncomingMsg(socket, rec)
        })

        socket.on('end', function () {
            console.log('#end')
            delete activePlayers[socket]
        })

        socket.on('close', function () {
            console.log('#close')
        })
    }
}

exports.GameServer = GameServer


