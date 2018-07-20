let assert = require('assert');
const sinon = require("sinon");
const StatePlantWilted = require("../../../logic/states/state_wilted").StatePlantWilted
const StatePlantReady = require("../../../logic/states/state_ready").StatePlantReady
const StatePlant = require("../../../logic/states/state_plant").StatePlant
const StatePlanted = require("../../../logic/states/state_planted").StatePlanted
const StateHoleGround = require("../../../logic/states/state_holeground").StateHoleGround
const Tile = require('../../../logic/states/tile').Tile
const StateHighGrass = require('../../../logic/states/state_highgrass').StateHighGrass
const StateGround = require('../../../logic/states/state_ground').StateGround
const StateGround_PLOT_NUMBER = require('../../../logic/states/state_ground').PLOT_NUMBER
const StateGrass = require("../../../logic/states/state_grass").StateGrass
const PLANTS = require("../../../logic/states/plants").PLANTS

describe('state plant', function () {


    describe('StatePlant should ignore input', function () {

        it('# plot num = ' + StateGround_PLOT_NUMBER, function () {
            let tile = new Tile(new StatePlant())
            tile.handleInput()
            assert(tile.state instanceof StatePlant)
        })
    })

    describe('StatePlant should transit to StatePlantReady', function () {

        it('# plot num = ' + StateGround_PLOT_NUMBER, function () {
            let tile = new Tile(new StatePlant())

            for (let i = 0; i < PLANTS[tile.plantType].growTime; i++) {
                assert(tile.state instanceof StatePlant)
                tile.handleInput() // watering
                tile.handleTick()
            }

            assert(tile.state instanceof StatePlantReady)
        })
    })

    describe('StatePlant should NOT transit to StatePlantReady when not watered', function () {

        it('# plot num = ' + StateGround_PLOT_NUMBER, function () {
            let tile = new Tile(new StatePlant())

            for (let i = 0; i < PLANTS[tile.plantType].growTime; i++) {
                assert(tile.state instanceof StatePlant)
                tile.handleTick()
            }

            assert(tile.state instanceof StatePlant)
        })
    })

})

