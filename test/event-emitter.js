/* global describe, it */
import EventEmitter from '../src/js/event-emitter';

const eventEmitter = new EventEmitter();

describe('Event Emitter', () => {

    it('#on', (done) => {
        eventEmitter.on('test-on', done);

        setTimeout(() => {
            eventEmitter.trigger('test-on');
        }, 50);
    });

    it('#off', (done) => {
        let testOff = null;

        eventEmitter.on('test-off', () => {

            testOff = new Error('Callback triggered');
        });

        setTimeout(() => {
            
            eventEmitter.off('test-off');
        }, 10);

        setTimeout(() => {

            eventEmitter.trigger('test-off');
            done(testOff);
        }, 50);
    });
});
