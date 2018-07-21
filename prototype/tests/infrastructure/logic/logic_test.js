const assert = require('assert');
const net = require('net');
const EventEmitter = require('events').EventEmitter;
const sinon = require("sinon");
const EventsIn = require("../../../infrastructure/network/events").EventsIn
const GameLogic = require("../../../infrastructure/logic/logic").GameLogic

describe('Logic', function () {

    var logic
    var dispatcher
    var mock

    beforeEach(function () {
        dispatcher = new EventEmitter()
        logic = new GameLogic()
        mock = sinon.mock(logic)
    })

    after(function () {
    })

    let params = []
    Object.keys(EventsIn).map((o)=>{
        let classType = EventsIn[o]
        let obj = new classType();
        params.push(obj)
    })

    params.forEach((event)=>{
        it('should Logic class handle event ' + event.name(), function () {
            mock.expects(event.name()).once()
            logic.bindDispatcher(dispatcher)
            dispatcher.emit(event.name())
            mock.verify()
        });
    })



})

