const StateGround = require("./state_ground").StateGround
const StatePlantWilted = require("./state_wilted").StatePlantWilted
const TileState = require('./state').TileState

class StatePlantReady extends TileState {

    constructor() {
        super()
        this.elapsedTime = 0
    }

    handleInput() {
        this.clicksLeft--
        if(this.clicksLeft <= 0) {
            this.tile.harvestPlants()
            return this.link(new StateGround())
        }
        return null
    }

    handleTick() {
        this.elapsedTime++

        if(this.elapsedTime >= this.tile.wiltedTime()) {
            return this.link(new StatePlantWilted())
        }

        return null
    }

    getLevel() {
        return 7
    }

    enter() {
    }
}

exports.StatePlantReady=StatePlantReady
