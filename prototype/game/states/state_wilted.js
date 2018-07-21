let TileState = require('./state').TileState

class StatePlantWilted extends TileState {

    constructor() {
        super()
    }

    handleInput(touched) {
        this.clicksLeft--
        if(this.clicksLeft <= 0) {
            return this.link('StateGround')
        }
        return null
    }

    getLevel() {
        return 8
    }

    enter() {
        this.tile.setWilted()
    }
}


exports.StatePlantWilted=StatePlantWilted