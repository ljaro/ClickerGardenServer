let assert = require('assert');
const sinon = require("sinon");
const StatePlanted = require("../../../game/states/state_planted").StatePlanted
const Tile = require("../../../game/states/tile").Tile
const StateHoleGround = require("../../../game/states/state_holeground").StateHoleGround
const StateGround_PLOT_NUMBER = require('../../../game/states/state_ground').PLOT_NUMBER


describe('state holeground', function () {


    describe('after clicks should change from StateHoleGround to StatePlanted #', function () {

        it('# plot num = ' + StateGround_PLOT_NUMBER, function () {
            let tile = new Tile(new StateHoleGround())
            assert(tile.state instanceof StateHoleGround, 'StateHoleGround at start')

            for (let i = 0; i < StateGround_PLOT_NUMBER; i++) {
                assert(tile.state instanceof StateHoleGround)
                tile.handleInput()
            }

            assert(tile.state instanceof StatePlanted)
        })
    })

    describe('Tile before harvesting should have 6 plants', function () {

        it('# plot num = ', function () {
            let tile = new Tile(new StateHoleGround())

            for (let i = 0; i < StateGround_PLOT_NUMBER; i++) {
                tile.handleInput() // put plant
            }

            assert(tile.state instanceof StatePlanted)
            assert.equal(tile.plants, StateGround_PLOT_NUMBER)
        })
    })

})

