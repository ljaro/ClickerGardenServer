let TileState = require('./state').TileState

class StatePlant extends TileState {

    constructor() {
        super()
        this.growTime = 0
        this.waterNeed = 3
    }

    handleInput() {

        this.watering()

        return null
    }

    handleTick() {
        this.waterNeed++
        if(this.waterNeed > this.tile.waterNeed()) {
            return null
        }

        this.growTime++
        //todo refactor. why redirecting back to ask plant data
        let state = this.tile.handleTime(this.growTime)

        if(state) {
            return state
        }

        return null
    }

    watering() {
        // schedule animation time frame where user cannot interact
        this.waterNeed = 0
    }

    getLevel() {
        return 6
    }

    enter() {
    }
}

exports.StatePlant=StatePlant
