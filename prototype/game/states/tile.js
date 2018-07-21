const StatePlantReady = require("./state_ready").StatePlantReady

const PLANTS = require('./plants').PLANTS
const StateHighGrass = require('./state_highgrass').StateHighGrass

class Tile {

    constructor(state) {
        this.state = state || new StateHighGrass()
        this.state.tile = this

        this.wilted = false
        this.plants = 0
        this.pathesMax = 6
        this.plantType = 'carrot'

        this.state.enter()
    }

    handleInput() {
        let state = this.state.handleInput()
        this.handleState(state)
    }

    handleTick() {
        let state = this.state.handleTick()
        this.handleState(state)
    }

    putPlant() {
        if(this.plants >= this.pathesMax) {
            return false
        }

        this.plants++

        return this.plants < this.pathesMax
    }

    harvestPlants() {
        this.plants = 0
    }

    cleanGround(){
        this.plants = 0
    }

    handleState(newState) {
        if(newState) {
            if(this.state) {
                this.state.exit()
            }

            this.state = newState
            this.state.enter()
        }
    }

    handleTime(time) {
        let ready = (time >= PLANTS[this.plantType].growTime)

        if(ready === true) {
            let state = this.state.link(new StatePlantReady())
            return state
        }

        return null
    }

    waterNeed() {
        return PLANTS[this.plantType].waterNeed
    }

    wiltedTime() {
        return PLANTS[this.plantType].wiltedTime
    }

    setWilted() {
        this.wilted = true
    }
}

exports.Tile = Tile