const assert = require('assert');
const net = require('net');
const sinon = require("sinon");


const EventsDispatcher = require("../../infra/core/events_dispatcher").EventsDispatcher;
const Auth = require('../../auth/auth').Auth;

describe('EventsDispatcher', function () {

    it('should throw when registering wrong listener', function () {
        const dispatcher = new EventsDispatcher();
        const wrongListener = {};

        assert.throws(()=>{
            dispatcher.registerListener(wrongListener);
        }, /Listener must implement getGroup method$/);
    });

    it('should throw when listener is undefined', function () {
        const dispatcher = new EventsDispatcher();
        const wrongListener = undefined;

        assert.throws(()=>{
            dispatcher.registerListener(wrongListener);
        }, /Listener must be defined$/);
    });

    it('should throw when listener is null', function () {
        const dispatcher = new EventsDispatcher();
        const wrongListener = null;

        assert.throws(()=>{
            dispatcher.registerListener(wrongListener);
        }, /Listener must be defined$/);
    });

    it('should throw when listener doesnt have handleEvent method', function () {
        const dispatcher = new EventsDispatcher();
        const wrongListener = {getGroup:function(){}};

        assert.throws(()=>{
            dispatcher.registerListener(wrongListener);
        }, /Listener must implement handleEvent$/);
    });

    it('should register listener for single group', function () {
        const dispatcher = new EventsDispatcher();
        const listenerAny = {
            getGroup: sinon.stub().returns('any'),
            handleEvent: sinon.spy(),
            addEmitter: sinon.spy()
        };

        dispatcher.emitter.on = sinon.spy();
        dispatcher.registerListener(listenerAny);

        assert(dispatcher.emitter.on.callCount === 1);
        assert(dispatcher.emitter.on.withArgs('any').calledOnce);
    });

    it('should register listener for two groups', function () {
        const dispatcher = new EventsDispatcher();
        const listenerAny = {
            getGroup: sinon.stub().returns(['any', 'other']),
            handleEvent: sinon.spy(),
            addEmitter: sinon.spy()
        };

        dispatcher.emitter.on = sinon.spy();
        dispatcher.registerListener(listenerAny);

        assert(dispatcher.emitter.on.callCount === 2);
        assert(dispatcher.emitter.on.withArgs('any').calledOnce);
        assert(dispatcher.emitter.on.withArgs('other').calledOnce);
    });

    it('should send event to event group', function () {
        const dispatcher = new EventsDispatcher();

        const listenerAny = {
            getGroup: sinon.stub().returns('any'),
            handleEvent: sinon.spy(),
            addEmitter: sinon.spy()
        };

        const listenerAny2 = {
            getGroup: sinon.stub().returns(['any', '2']),
            handleEvent: sinon.spy(),
            addEmitter: sinon.spy()
        };

        const listener1 = {
            getGroup: sinon.stub().returns('1'),
            handleEvent: sinon.spy(),
            addEmitter: sinon.spy()
        };

        const listener2 = {
            getGroup: sinon.stub().returns('2'),
            handleEvent: sinon.spy(),
            addEmitter: sinon.spy()
        };

        dispatcher.registerListener(listener1);
        dispatcher.registerListener(listenerAny);
        dispatcher.registerListener(listenerAny2);
        dispatcher.registerListener(listener2);

        const event = {id: 1, group: 'any', msg: {}}
        dispatcher.dispatch(event);

        assert(listenerAny.handleEvent.withArgs(event).calledOnce)
        assert(listenerAny2.handleEvent.withArgs(event).calledOnce)
        assert(listener1.handleEvent.notCalled)
        assert(listener2.handleEvent.notCalled)


        // -------

        listenerAny.handleEvent.resetHistory();
        listenerAny2.handleEvent.resetHistory();
        listener1.handleEvent.resetHistory();
        listener2.handleEvent.resetHistory();

        const event2 = {id: 1, group: '2', msg: {}}
        dispatcher.dispatch(event2);

        assert(listenerAny.handleEvent.notCalled)
        assert(listener1.handleEvent.notCalled)
        assert(listenerAny2.handleEvent.withArgs(event2).calledBefore(listener2.handleEvent.withArgs(event2)))
    });

    it('should add dispatch method to listener', function () {
        const dispatcher = new EventsDispatcher();
        const listenerAny = new Auth();

        dispatcher.registerListener(listenerAny);

        let mock = sinon.mock(dispatcher);
        mock.expects('dispatch').once().on(dispatcher)

        listenerAny.dispatch({})
        mock.verify()
    });

    it('should add another dispatcher to listener', function () {
        const dispatcher = new EventsDispatcher();
        const dispatcher2 = new EventsDispatcher();
        const listenerAny = new Auth();

        dispatcher.registerListener(listenerAny);
        dispatcher2.registerListener(listenerAny);

        let mock = sinon.mock(dispatcher);
        mock.expects('dispatch').once().on(dispatcher)
        let mock2 = sinon.mock(dispatcher2);
        mock2.expects('dispatch').once().on(dispatcher2)

        listenerAny.dispatch({})
        mock.verify()
        mock2.verify()
    });
});

