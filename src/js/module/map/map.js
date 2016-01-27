import { View } from '../../core';
import Const from '../../const';
import GoogleMaps from 'google-maps';

/**
 * Makes Google map events chainable
 */
const mapEvent = (instance, context) => ({
  addListener: function addListener(event, callback) {
    instance.addListener(context, event, callback);
    return this;
  }});

export default View.extend({
  map: null,
  panorama: null,

  initialize({ }) {
    const model = this.model;
    const element = this.el;

    this.app.setState(Const.State.MAP);
    GoogleMaps.KEY = this.app.options.googleApiKey;

    this.initializeMaps()
      .then((google) => {
        this.map = new google.maps.Map(element, {
          scrollwheel: this.app.options.scrollwheel || false,
          center: new google.maps.LatLng(model.get('lat'), model.get('lng')),
          zoom: model.get('zoom'),
        });
        this.panorama = this.map.getStreetView();

        mapEvent(google.maps.event, this.panorama)
          .addListener('visible_changed', () => {
            this.app
              .trigger(Const.Event.VISIBLE_CHANGED, this.panorama.getVisible());
          })
          .addListener('position_changed', () => this.storeMapData())
          .addListener('pov_changed', () => this.storeMapData());
      });
    this.app
      .on(Const.Event.START_PLANTING, this.disableUIElements, this)
      .on(Const.Event.START_PLANTING, this.storePanoCoords, this);
  },

  storeMapData() {
    const position = this.panorama.getPosition();
    const lat = position.lat();
    const lng = position.lng();
    const { heading, pitch } = this.panorama.getPov();

    this.model.set({ lat, lng, heading, pitch });
  },

  initializeMaps() {
    return new Promise(GoogleMaps.load);
  },

  initializeViewer(options) {
    const element = this.el;

    this.app.setState(Const.State.VIEWER);
    GoogleMaps.KEY = this.app.options.googleApiKey;

    this.initializeMaps()
      .then((google) => {
        this.map = new google.maps.StreetViewPanorama(element, options);
      });
  },

  getDisableUIOptions() {
    return {
      panControl: false,
      zoomControl: false,
      addressControl: false,
      linksControl: false,
    };
  },

  disableUIElements() {
    this.panorama.setOptions(this.getDisableUIOptions());
  },

  storePanoCoords() {
    const position = this.panorama.getPosition();

    this.session()
      .setPanoCoords({
        lat: position.lat(),
        lng: position.lng(),
        zoom: this.panorama.getZoom(),
      });
  },
});
