let assert = require('assert');
const sinon = require("sinon");
const StateGround = require("../../../game/states/state_ground").StateGround
const StateGrass = require("../../../game/states/state_grass").StateGrass
const Tile = require("../../../game/states/tile").Tile

describe('state grass', function () {

    describe('after clicks should change from StateGrass to StateGround #', function () {

        var params = Array.from(Array(10).keys())
        params.shift()
        params.forEach(function (param_clicks) {
            it('# clicks = ' + param_clicks, function () {
                let tile = new Tile(new StateGrass())
                assert(tile.state instanceof StateGrass, 'StateGrass at start')
                tile.state.clicksLeft = param_clicks
                const clicks = tile.state.clicksLeft

                for (let i = 0; i < clicks; i++) {
                    assert(tile.state instanceof StateGrass)
                    tile.handleInput()
                }

                assert(tile.state instanceof StateGround)
            })
        })
    })

})

