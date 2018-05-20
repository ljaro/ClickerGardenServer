let assert = require('assert');
const sinon = require("sinon");
const StatePlantWilted = require("../tile_sm/state_wilted").StatePlantWilted
const StatePlantReady = require("../tile_sm/state_ready").StatePlantReady
const StatePlant = require("../tile_sm/state_plant").StatePlant
const StatePlanted = require("../tile_sm/state_planted").StatePlanted
const StateHoleGround = require("../tile_sm/state_holeground").StateHoleGround
const Tile = require('../tile_sm/tile').Tile
const StateHighGrass = require('../tile_sm/state_highgrass').StateHighGrass
const StateGround = require('../tile_sm/state_ground').StateGround
const StateGround_PLOT_NUMBER = require('../tile_sm/state_ground').PLOT_NUMBER
const StateGrass = require("../tile_sm/state_grass").StateGrass
const PLANTS = require("../tile_sm/plants").PLANTS

describe('state ready', function () {


    describe('StatePlantReady should transit to StatePlantWilted', function () {

        it('# plot num = ', function () {
            let tile = new Tile(new StatePlantReady())

            for (let i = 0; i < PLANTS[tile.plantType].wiltedTime; i++) {
                assert(tile.state instanceof StatePlantReady)
                tile.handleTick()
            }

            assert(tile.state instanceof StatePlantWilted)
        })
    })

    describe('StatePlantReady after harvesting should transit to StateGround', function () {

        it('# plot num = ', function () {
            let tile = new Tile(new StatePlantReady())
            const c = tile.state.clicksLeft

            for (let i = 0; i < c; i++) {
                assert(tile.state instanceof StatePlantReady)
                tile.handleInput() // harvesting
            }

            assert(tile.state instanceof StateGround)
        })
    })

    describe('Tile after harvesting should have 0 plants', function () {

        it('# plot num = ', function () {
            let tile = new Tile(new StatePlantReady())
            tile.plants = StateGround_PLOT_NUMBER

            assert(tile.state instanceof StatePlantReady)

            const c = tile.state.clicksLeft
            for (let i = 0; i < c; i++) {
                tile.handleInput() // harvest
            }

            assert.equal(tile.plants, 0)
        })
    })
})

