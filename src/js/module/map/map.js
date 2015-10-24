var Core = require('core');
var Const = require('const');
var GoogleMaps = require('google-maps');

var MapView = Core.View.extend({
    map: null,
    panorama: null,

    initialize: function(obj) {
        var model = this.model;
        var element = this.el;

        this.app.setState(Const.State.MAP);
        GoogleMaps.KEY = this.app.options.googleApiKey;

        this.initializeMaps()
            .then(function(google) {
                this.map = new google.maps.Map(element, {
                    scrollwheel: this.app.options.scrollwheel || false,
                    center: new google.maps.LatLng(model.get('lat'), model.get('lng')),
                    zoom: model.get('zoom')
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
            linksControl: false
        };
    },

    disableUIElements: function() {

        this.panorama.setOptions(this.getDisableUIOptions());
    },

    storePanoCoords: function() {
        var position = this.panorama.getPosition();

        this.session()
            .setPanoCoords({
                lat: position.lat(),
                lng: position.lng(),
                zoom: this.panorama.getZoom()
            });
    }
});

module.exports = {
    View: MapView
};
