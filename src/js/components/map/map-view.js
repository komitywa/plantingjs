Planting.Map.MapView = Backbone.View.extend({
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

            Planting.Mediator.trigger(Planting.Event.VISIBLE_CHANGED, this.panorama.getVisible());
        }.bind(this));

        Planting.Mediator.on(Planting.Event.START_PLANTING, this.disableUIElements, this);
    },

    disableUIElements: function() {
        this.panorama.setOptions({
            panControl: false,
            zoomControl: false,
            addressControl: false,
            linksControl: false
        });
    }
});
