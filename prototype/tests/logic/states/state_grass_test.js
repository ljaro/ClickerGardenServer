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

