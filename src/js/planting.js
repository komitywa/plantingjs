import { Deferred as deferredObject } from 'jquery';
import 'jquery-ui';
import underscore from 'underscore';
import EventEmitter from './event-emitter';
import Const from './const';
import SessionDataModel from './session-data';
import ManifestoDataModel from './manifesto-data';
import MainView from './modules/main/main';
import Plant from './modules/plant/plant';
import Sidebar from './modules/toolbox/sidebar';
import MapView from './modules/map/map';
import LayersManager from './modules/layers-manager/layers-manager';


export default class extends EventEmitter {
  constructor(options) {
    const initDefer = deferredObject();

    super(options);
    this._state = null;
    this.options = options;
    this.data = {
      session: new SessionDataModel(null, {
        app: this,
      }),
      manifesto: new ManifestoDataModel(null, {
        url: options.manifestoUrl,
        app: this,
      }),
    };
    this.setState(Const.State.INITING);
    this.manifesto()
        .fetch()
        .done(() => {
          this._initializeViews();
          initDefer.resolve();
        });
    this.initDefer = initDefer.promise();
  }

  session() {
    return this.data.session;
  }

  manifesto() {
    return this.data.manifesto;
  }

  setState(state) {
    const prevState = this._state;

    this._state = state;
    this.trigger(Const.Event.STATE_CHANGED, this._state, prevState);

    return this;
  }

  getState() {
    return this._state;
  }

  _initializeViews() {
    this.main = new MainView({
      el: this.options.container,
      manifesto: this.manifesto().toJSON(),
      app: this,
    });
    this.overlay = new Plant.View.Overlay({
      el: this.main.el.querySelector('.plantingjs-overlay'),
      collection: this.session().objects(),
      app: this,
    });
    this.toolbox = new Sidebar({
      el: this.main.el.querySelector('.plantingjs-toolbox'),
      app: this,
    });
    this.map = new MapView({
      el: this.main.el.querySelector('.plantingjs-google'),
      model: this.manifesto(),
      app: this,
    });
    this.layersManager = new LayersManager.View.Menu({
      $parent: this.main.$proxy,
      collection: this.session().objects(),
      app: this,
    });
  }

  initPlant(objects) {
    underscore.each(objects, (object) => {
      this.session()
        .objects()
        .add(object, {
          parse: true,
          app: this,
        });
    });
  }

  initViewer(options) {
    const panoOptions = {
      position: {
        lat: options.lat,
        lng: options.lng,
      },
      pov: {
        heading: options.heading,
        pitch: options.pitch,
        zoom: options.zoom,
      },
    };
    const objects = options.objects;

    this.initDefer
      .then(() => {
        this.setState(Const.State.VIEWER);
        this.map.initializeViewer(panoOptions);

        if (objects &&
          objects.length) {
          this.initPlant(objects);
        }
      });
  }

  initStreetview({ lat, lng, heading, pitch, zoom }) {
    const panoOptions = {
      position: { lat, lng },
      pov: { heading, pitch, zoom },
    };

    this.initDefer
      .then(() => {
        this.map.initializeViewer(panoOptions);
        this.app.trigger(Const.Event.START_PLANTING);
      });
  }
}
