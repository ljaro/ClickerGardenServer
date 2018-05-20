const StateGrass = require("./state_grass").StateGrass
const TileState = require('./state').TileState

class StateHighGrass extends TileState {

    constructor() {
        super()
        this.clicksLeft = 0
        this.clicksMax = 0
    }

    handleInput() {
        this.clicksLeft--

        if (this.clicksLeft <= 0) {
            return this.link(new StateGrass())
        }

        return null
    }

    spawnGrassOrRock(number) {
        this.clicksLeft = number
        this.clicksMax = number
    }

    getLevel() {
        return 1
    }

    enter() {
        this.spawnGrassOrRock(5)
    }
}


exports.StateHighGrass=StateHighGrass