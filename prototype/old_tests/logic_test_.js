let assert = require('assert');
const sinon = require("sinon");
const GameServer = require("../infrastructure/server").GameServer
const GameLogic = require('../logic.js').GameLogic

xdescribe('GameLogic', function () {


    before(function() {
        this.clock = sinon.useFakeTimers();
    });

    after(function() {
        this.clock.restore();
    });

    it('at he begining no broadcastMessage called', function () {
        let server = {"broadcastMessage": function () {}}
        let mock = sinon.mock(server)
        mock.expects("broadcastMessage").never()
        const game = new GameLogic(server)
        game.start()
        mock.verify()
        game.stop()
    })

    it('tractor sent broadcast every 3 seconds', function () {
        let server = {"broadcastMessage": function () {}}
        let mock = sinon.mock(server)
        mock.expects("broadcastMessage").exactly(3).withArgs('tractor sent')
        const game = new GameLogic(server)

        game.start()

        this.clock.tick(3000)

        this.clock.tick(3000)

        this.clock.tick(3000)

        mock.verify()
        game.stop()
    })

    describe('GameLogic - cleanup', function () {
        it('tractor interval should be stopped when server start and stop quickly', function () {
            let server = {"broadcastMessage": function () {}}
            let mock = sinon.mock(server)
            mock.expects("broadcastMessage").never()
            const game = new GameLogic(server)

            game.start()
            game.stop()
            this.clock.tick(10000)
            mock.verify()
        })

        it('tractor interval should be stopped when server start and tick not enough to send message', function () {
            let server = {"broadcastMessage": function () {}}
            let mock = sinon.mock(server)
            mock.expects("broadcastMessage").never()
            const game = new GameLogic(server)

            mock.expects("broadcastMessage").never()
            game.start()
            this.clock.tick(2000)
            game.stop()
            this.clock.tick(5000)
            mock.verify()
        })

        it('tractor interval should be stopped when server start and make two broadcasts', function () {
            let server = {"broadcastMessage": function () {}}
            let mock = sinon.mock(server)
            mock.expects("broadcastMessage").never()
            const game = new GameLogic(server)

            mock.expects("broadcastMessage").twice()
            game.start()
            this.clock.tick(7000)
            game.stop()
            this.clock.tick(6000)
            mock.verify()
        })
    })

})

