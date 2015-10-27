import { View } from 'core';
import Const from 'const';
import GoogleMaps from 'google-maps';

const MapView = View.extend({
  map: null,
  panorama: null,

  initialize: function() {
    const model = this.model;
    const element = this.el;

    this.app.setState(Const.State.MAP);
    GoogleMaps.KEY = this.app.options.googleApiKey;

    this.initializeMaps()
      .then(function(google) {
        this.map = new google.maps.Map(element, {
          scrollwheel: this.app.options.scrollwheel || false,
          center: new google.maps.LatLng(model.get('lat'), model.get('lng')),
          zoom: model.get('zoom'),
        });
        this.panorama = this.map.getStreetView();

        google.maps.event.addListener(this.panorama, 'visible_changed', function() {
          this.app.trigger(Const.Event.VISIBLE_CHANGED, this.panorama.getVisible());
        }.bind(this));
      }.bind(this));

    this.app
      .on(Const.Event.START_PLANTING, this.disableUIElements, this)
      .on(Const.Event.START_PLANTING, this.storePanoCoords, this);
  },

  initializeMaps: function() {
    return new Promise(GoogleMaps.load);
  },

  initializeViewer: function(options) {
    this.panorama = new google.maps.StreetViewPanorama(this.el, options);
  },

  getDisableUIOptions: function() {
    return {
      panControl: false,
      zoomControl: false,
      addressControl: false,
      linksControl: false,
    };
  },

  disableUIElements: function() {
    this.panorama.setOptions(this.getDisableUIOptions());
  },

  storePanoCoords: function() {
    const position = this.panorama.getPosition();

    this.session()
      .setPanoCoords({
        lat: position.lat(),
        lng: position.lng(),
        zoom: this.panorama.getZoom(),
      });
  },
});

module.exports = {
  View: MapView,
};
