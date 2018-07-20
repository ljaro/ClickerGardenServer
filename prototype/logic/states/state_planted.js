const StatePlant = require("./state_plant").StatePlant
const TileState = require('./state').TileState

class StatePlanted extends TileState {

    constructor() {
        super()
        this.growTime = 0
        this.waterNeed = 3
        this.elapsedTime = 0
    }

    handleInput() {
        return this.link(new StatePlant())
    }

    getLevel() {
        return 5
    }

    enter() {
    }
}


exports.StatePlanted=StatePlanted