(function (Core, Event, State, Map) {

    Map.View = Core.View.extend({
        map: null,
        panorama: null,

        initialize: function(obj) {
            this.app.setState(State.MAP);
            this.map = new google.maps.Map(this.el, this.getMapOptions());
            this.panorama = this.map.getStreetView();
            this.initializeMapEvents();
            this.app
                .on(Event.START_PLANTING, this.disableUIElements, this)
                .on(Event.START_PLANTING, this.storePanoCoords, this);
        },

        initializeViewer: function(options) {

            this.panorama = new google.maps.StreetViewPanorama(this.el, options);
        },

        initializeMapEvents: function() {
            
            google.maps.event.addListener(this.panorama, 'visible_changed', function() {

                this.app.trigger(Event.VISIBLE_CHANGED, this.panorama.getVisible());
            }.bind(this));
        },

        getMapOptions: function() {

            return {
                center: new google.maps.LatLng(this.model.get('lat'), this.model.get('lng')),
                zoom: this.model.get('zoom')
            };
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

} (
    Planting.module('core'),
    Planting.Event,
    Planting.State,
    Planting.module('map')
) );
