const StateGround = require("./state_ground").StateGround
const TileState = require('./state').TileState

class StateGrass extends TileState {

    constructor() {
        super()
    }

    handleInput(touched) {

        if (!touched)
        {
            this.clicksLeft--
        }

        if (this.clicksLeft <= 0)
        {
            return this.link(new StateGround())
        }

        return null
    }

    enter() {
    }

    getLevel() {
        return 2
    }
}

exports.StateGrass = StateGrass
