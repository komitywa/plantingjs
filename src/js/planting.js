import 'jquery-ui';
import lodash from 'lodash';
import EventEmitter from './event-emitter';
import Const from './const';
import SessionDataModel from './session-data';
import ManifestoDataModel from './manifesto-data';
import MainView from './modules/main/main';
import PlantOverlayView from './modules/plant/overlay';
import Sidebar from './modules/toolbox/sidebar';
import MapView from './modules/map/map';
import LayersManagerView from './modules/layers-manager/menu-view';
import ModalView from './modules/components/modal';


export default class extends EventEmitter {
  constructor(options) {
    super(options);
    this._state = null;
    this.visibleModal = null;
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
    this.data.options = Object.assign(
      {}, Const.DefaultSettings, options.options || {});
    this.setState(Const.State.INITING);
    this.initDefer = new Promise((resolve) => {
      this.manifesto()
        .fetch()
        .done(() => {
          this._initializeViews();
          resolve();
        });
    });
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
    this.overlay = new PlantOverlayView({
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
    if (this.data.options.LAYERABILITY) {
      this.layersManager = new LayersManagerView({
        $parent: this.main.$proxy,
        collection: this.session().objects(),
        app: this,
      });
    }
  }

  initPlant(objects) {
    lodash.each(objects, (object) => {
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

  initStreetview({ lat, lng, heading, pitch, zoom, options }) {
    const panoOptions = {
      position: { lat, lng },
      pov: { heading, pitch, zoom },
    };

    this.data.options = Object.assign({}, Const.DefaultSettings, options || {});

    this.initDefer
      .then(() => {
        this.setState(Const.State.PLANTING);
        this.data.session.setPanoCoords({ lat, lng, heading, pitch, zoom });
        this.map
          .initializeViewer(panoOptions)
          .then(() => {
            this.trigger(Const.Event.START_PLANTING);
          });
      });
  }

  modal(ChildView) {
    if (this.visibleModal) {
      this.visibleModal.remove();
      this.visibleModal = null;
    }

    this.visibleModal = new ModalView({
      childView: new ChildView({ app: this }),
      el: this.main.getModal(),
    });

    return this.visibleModal;
  }
}
