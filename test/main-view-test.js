/* global describe,beforeEach,afterEach,before,it:false */
import environment from './env/client';
import { equal } from 'assert';
import sinon from 'sinon';
import Main from '../src/js/modules/main/main';

describe('Main view', () => {
  let instance;
  let events = {};
  let app = {};
  let sessionSave;

  function eventsMock(namespace) {
    const api = {
      on: (ev, fn, cx) => {
        events[namespace][ev] = fn.bind(cx);
        return api;
      },
    };

    events[namespace] = {};
    return api;
  }

  function session() {
    return {
      objects: () => ({
        ...eventsMock('session'),
      }),
      save: sessionSave,
    };
  }

  function appMock() {
    return {
      options: {
        selectPanoMode: true,
      },
      getState: () => {},
      data: {
        session: session(),
      },
      ...eventsMock('app'),
    };
  }

  function preparation() {
    sessionSave = sinon.spy();
    app = appMock();
    instance = new Main({ app });
  }

  function cleanup() {
    instance.remove();
  }

  before(cb => environment.then(() => cb()));
  beforeEach(preparation);
  afterEach(cleanup);

  it('Should render base DOM elements', () => {
    const count = (selector) => instance.$el.find(selector).length;

    instance.render();
    equal(count('.layers-menu'), 1);
    equal(count('.plantingjs-toolbox'), 1);
    equal(count('.plantingjs-overlay'), 1);
    equal(count('.plantingjs-google'), 1);
    equal(count('.plantingjs-modal'), 1);
  });

  it('Should update start button on visibility change', () => {
    instance.start.model.set = sinon.spy();
    events.app.visible_changed(true);
    equal(instance.start.model.set.calledWith({ visible: true }), true);
  });

  it('Should add class to the container when user starts planting', () => {
    events.app.start_planting();
    equal(instance.el.classList.contains('plantingjs-is-planting'), true);
  });

  describe('Submit button', () => {
    it('Should call session.save whenever user clicked button', () => {
      instance.submit.el.click();
      equal(sessionSave.called, true);
    });
  });

  describe('#getModal', () => {
    it('Should return modal DOM element', () => {
      instance.render();
      equal(instance.getModal().hasClass('plantingjs-modal'), true);
    });
  });
});
