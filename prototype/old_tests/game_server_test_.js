let assert = require('assert');
const sinon = require("sinon");
const GameServer = require("../server").GameServer


xdescribe('GameServer', function () {
    
    it('more than one player should be accessible after login', function () {
        
    })

    it('broadcast should send to all players', function () {
        let server = new GameServer()
        let stub1 = sinon.stub(server, "getActivePlayers")

        let players = {
            "token1": {"socket": {"write": function (msg) {}}},
            "token2": {"socket": {"write": function (msg) {}}},
            "token3": {"socket": {"write": function (msg) {}}},
            "token4": {"socket": {"write": function (msg) {}}},
            "token5": {"socket": {"write": function (msg) {}}},
            "token6": {"socket": {"write": function (msg) {}}},
            "token7": {"socket": {"write": function (msg) {}}}
        }

        let playersCount = Object.keys(players).length

        let playersMocks = Object.keys(players).map(function (key) {
            let player = players[key]
            let mock = sinon.mock(player.socket)
            mock.expects("write").once()

            players[key] = player

            return mock
        })

        stub1.returns(players)

        server.broadcastMessage('sample msg')


        assert.equal(playersCount, Object.keys(playersMocks).length)

        for (const [key, value] of Object.entries(playersMocks)) {
            value.verify()
        }

    });

    it('on farm state server should respond with data', function () {
    });

})

