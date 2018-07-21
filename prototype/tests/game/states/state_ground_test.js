let assert = require('assert');
const sinon = require("sinon");
const StateGround = require("../../../game/states/state_ground").StateGround
const StateHoleGround = require("../../../game/states/state_holeground").StateHoleGround
const Tile = require("../../../game/states/tile").Tile
const StateGround_PLOT_NUMBER = require('../../../game/states/state_ground').PLOT_NUMBER

describe('state ground', function () {

    describe('after clicks should change from StateGround to StateHoleGround #', function () {

        it('# plot num = ' + StateGround_PLOT_NUMBER, function () {
            let tile = new Tile(new StateGround())
            assert(tile.state instanceof StateGround, 'StateGround at start')
            const clicks = tile.state.clicksLeft

            for (let i = 0; i < clicks; i++) {
                assert(tile.state instanceof StateGround)
                tile.handleInput()
            }

            assert(tile.state instanceof StateHoleGround)
        })
    })

})

