const assert = require('assert');
const net = require('net');
const sinon = require("sinon");
const EventDispatcher = require("../../../infrastructure/network/event_dispatcher").EventDispatcher
const EventsIn = require("../../../infrastructure/network/events").EventsIn
const Events = require("../../../infrastructure/network/events").Events


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

    it('should pass parameter to emitted event', function (done) {
        this.timeout(20)
        let event = new Events.EventLogin('login1', 'pass1')
        dispatcher.on(event.name(), (arg1, arg2) => {
            assert(arg1 !== undefined)
            assert(arg2 !== undefined)
            done()
        })
        dispatcher.dispatch(event)
    });

})

