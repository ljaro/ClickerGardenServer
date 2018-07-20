const StateHoleGround = require("./state_holeground").StateHoleGround
const TileState = require('./state').TileState

const PLOT_NUMBER = 6

class StateGround extends TileState {

    constructor() {
        super()
        this.clicksLeft = PLOT_NUMBER
        this.clicksMax = PLOT_NUMBER
    }

    handleInput() {
        this.clicksLeft--;

        if (this.clicksLeft <= 0) {
            return this.link(new StateHoleGround())
        }

        return null;
    }

    enter() {
        this.tile.cleanGround()
    }

    getLevel() {
        return 3
    }
}

exports.StateGround=StateGround
exports.PLOT_NUMBER=PLOT_NUMBER