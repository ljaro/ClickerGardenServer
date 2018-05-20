

class TileState {
    constructor() {
        this.tile = undefined
        this.clicksLeft = 5
        this.clicksMax = 5
    }

    handleInput(touched) {
    }

    handleTick() {
        return null
    }

    handleHold(callback, touched) {
        // handling allow to stop flooding by player
    }

    enter() {
    }

    exit() {
    }


    getLevel() {
    }

    getClicksLeft() {
        return this.clicksLeft
    }

    link(state) {
        state.tile = this.tile
        return state
    }

}

exports.TileState = TileState