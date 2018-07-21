let assert = require('assert');
const sinon = require("sinon");
const Tile = require("../../../game/states/tile").Tile
const StatePlant = require("../../../game/states/state_plant").StatePlant
const StatePlanted = require("../../../game/states/state_planted").StatePlanted
const StateGround_PLOT_NUMBER = require('../../../game/states/state_ground').PLOT_NUMBER

describe('state planted', function () {


    describe('after clicks should change from StatePlanted and StatePlant #', function () {

        it('# plot num = ' + StateGround_PLOT_NUMBER, function () {
            let tile = new Tile(new StatePlanted())
            assert(tile.state instanceof StatePlanted, 'StatePlanted at start')

            tile.handleInput()

            assert(tile.state instanceof StatePlant)
        })
    })


})

