let assert = require('assert');
const sinon = require("sinon");

const Tile = require("../../../game/states/tile").Tile
const StateGrass = require("../../../game/states/state_grass").StateGrass
const StateHighGrass = require("../../../game/states/state_highgrass").StateHighGrass



describe('state highgrass', function () {


    describe('after clicks should change from StateHighGrass to StateGrass #', function () {

        var params = Array.from(Array(10).keys())
        params.shift()
        params.forEach(function (param_clicks) {
            it('# clicks = ' + param_clicks, function () {
                let tile = new Tile()
                assert(tile.state instanceof StateHighGrass, 'StateHighGrass at start')
                tile.state.clicksLeft = param_clicks
                const clicks = tile.state.clicksLeft

                for (let i = 0; i < clicks; i++) {
                    assert(tile.state instanceof StateHighGrass)
                    tile.handleInput()
                }

                assert(tile.state instanceof StateGrass)
            })
        })
    })


})

