'use strict';


class GameLogic {

    constructor() {
    }

    bindDispatcher(dispatcher) {
        dispatcher.on('playerCloseSocket', this.playerCloseSocket.bind(this))
        dispatcher.on('playerAboutToCloseSocket', this.playerAboutToCloseSocket.bind(this))
        dispatcher.on('clickField', this.clickField.bind(this))
        dispatcher.on('changeView', this.changeView.bind(this))
        dispatcher.on('activateBoost', this.activateBoost.bind(this))
        dispatcher.on('buyBoost', this.buyBoost.bind(this))
        dispatcher.on('buyGems', this.buyGems.bind(this))
        dispatcher.on('playerConnected', this.playerConnected.bind(this))
    }

    playerConnected() {

    }

    playerCloseSocket() {
    }

    playerAboutToCloseSocket() {

    }

    clickField() {

    }

    changeView() {

    }

    activateBoost() {

    }

    buyBoost() {

    }

    buyGems() {

    }
}

exports.GameLogic = GameLogic