(function(PlantingData) {

    PlantingData.Model = Backbone.Model.extend({
        url: 'http://plantingjs.org/save',

        defaults: {
            lat: null,
            lng: null,
            zoom: null,
            heading: null,
            manifesto: null,
            objects: [],
            pitch: 0
        },
        
        setPanoCoords: function(data) {

            this.set(data);
        },

        setObjects: function(objectsArray) {

            this.set('objects', objectsArray);
        },

        save: function() {
            console.log(this.toJSON());
        }
    });

}(
    Planting.module('plantingData')
));
