(function (Core, Event, Map) {

    Map.View = Core.View.extend({
        map: null,
        panorama: null,

        initialize: function(obj) {
            var mapOptions = {
                center: new google.maps.LatLng(obj.map.lat, obj.map.lng),
                zoom: obj.map.zoom,
            };

            this.map = new google.maps.Map(this.el, mapOptions);
            this.panorama = this.map.getStreetView();

            google.maps.event.addListener(this.panorama, 'visible_changed', function() {

                this.app.trigger(Event.VISIBLE_CHANGED, this.panorama.getVisible());
            }.bind(this));

            this.app
                .on(Event.START_PLANTING, this.disableUIElements, this)
                .on(Event.START_PLANTING, this.storePanoCoords, this);
        },

        disableUIElements: function() {
            this.panorama.setOptions({
                panControl: false,
                zoomControl: false,
                addressControl: false,
                linksControl: false
            });
        },

        storePanoCoords: function() {
            var position = this.panorama.getPosition();

            this.engineDataStore()
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
    Planting.module('map')
) );
