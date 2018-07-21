const assert = require('assert');
const net = require('net');
const sinon = require("sinon");
const EventDispatcher = require("../../../infrastructure/network/event_dispatcher").EventDispatcher
const EventsIn = require("../../../infrastructure/network/events").EventsIn


describe('EventDispatcher', function () {

    var dispatcher

    beforeEach(function () {
        dispatcher = new EventDispatcher()
    })

    after(function () {
    })

    let params = []
    Object.keys(EventsIn).map((o)=>{
        let classType = EventsIn[o]
        let obj = new classType();
        params.push(obj)
    })

    params.forEach(function (event) {
            it('should emit event '+ event.name(), function (done) {
                this.timeout(20)
                let msg = event
                dispatcher.on(event.name(), () => {
                    done()
                })
                dispatcher.dispatch(msg)
            })
    });

})

