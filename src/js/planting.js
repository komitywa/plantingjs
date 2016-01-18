import { Deferred as deferredObject } from 'jquery';
import underscore from 'underscore';
import EventEmitter from './event-emitter';
import Const from './const';
import SessionDataModel from './session-data';
import ManifestoDataModel from './manifesto-data';
import Main from './module/main/main';
import Plant from './module/plant/plant';
import Toolbox from './module/toolbox/toolbox';
import Map from './module/map/map';
import LayersManager from './module/layers-manager/layers-manager';

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
    this.main = new Main.View.Main({
      el: this.options.container,
      manifesto: this.manifesto().toJSON(),
      app: this,
    });
    this.overlay = new Plant.View.Overlay({
      el: this.main.el.querySelector('.plantingjs-overlay'),
      collection: this.session().objects(),
      app: this,
    });
    this.toolbox = new Toolbox.View.Sidebar({
      el: this.main.el.querySelector('.plantingjs-toolbox'),
      app: this,
    });
    this.map = new Map.View({
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
    this.main.dialog.close();
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

    this.main.dialog.close();
    this.initDefer
      .then(() => {
        this.map.initializeViewer(panoOptions);
        this.toolbox.show();
        this.setState(Const.State.PLANTING);
      });
  }
}
