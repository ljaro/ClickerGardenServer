const StatePlanted = require("./state_planted").StatePlanted
const TileState = require('./state').TileState

class StateHoleGround extends TileState {

    constructor() {
        super()
    }

    handleInput(touched) {

        if(false === this.tile.putPlant()) {
            let state = this.link(new StatePlanted())
            this.tile.handleState(state)
        }

        return null
    }

    getLevel() {
        return 4
    }

    enter() {
    }
}

exports.StateHoleGround=StateHoleGround