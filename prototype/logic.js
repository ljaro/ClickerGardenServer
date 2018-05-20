const TRACTOR_INTERVAL_SEC = 3


class GameLogic {
    constructor(server) {
        this.server = server
    }

    start() {
        console.log('Game logic started')
        let THIS = this
        this.setupTractor(function () {
            THIS.server.broadcastMessage('tractor sent')
        })
    }

    setupTractor(func) {
        //todo: because interval is constant, server not need to send every tick to players
        //could send only changes
        setInterval(function () {
            console.log('Tractor tick')
            if (func) func()
        }, TRACTOR_INTERVAL_SEC * 1000);
    }
}

exports.GameLogic = GameLogic