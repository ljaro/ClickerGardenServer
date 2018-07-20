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

xdescribe('Tile', function () {
    it('should be in StateHighGrass at the beginning', function () {
        let tile = new Tile()
        assert(tile.state instanceof StateHighGrass)
    });

    it('should call exit before new state', function () {
        let tile = new Tile()
        let state = tile.state.link(new StateGround())
        let mock = sinon.mock(tile.state)
        const mock2 = sinon.mock(state)
        mock.expects("exit")
        tile.handleState(state)
        mock.verify()
    });

})

