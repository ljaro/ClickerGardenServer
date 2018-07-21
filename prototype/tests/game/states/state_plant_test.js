let assert = require('assert');
const sinon = require("sinon");
const StatePlantReady = require("../../../game/states/state_ready").StatePlantReady
const PLANTS = require("../../../game/states/plants").PLANTS
const StatePlant = require("../../../game/states/state_plant").StatePlant
const Tile = require("../../../game/states/tile").Tile
const StateGround_PLOT_NUMBER = require('../../../game/states/state_ground').PLOT_NUMBER

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

