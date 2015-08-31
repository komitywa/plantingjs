(function(PlantingData) {

    PlantingData.Model = Backbone.Model.extend({
        url: 'http://plantingjs.org/save',
        ignoreObjectValues: [
            'userActivity',
            'projections'
        ],
        defaults: {
            lat: null,
            lng: null,
            zoom: null,
            heading: null,
            manifesto: null,
            objects: [],
            pitch: 0
        },

        initialize: function() {

            this.on('request', function() {
                console.log(this.toJSON());
            }, this);
        },

        setPanoCoords: function(data) {

            this.set(data);
        },

        setObjects: function(objectsArray) {
            var objects = _.map(objectsArray, function(object) {

                return _.omit(object, this.ignoreObjectValues);
            }, this);

            this.set('objects', objects);
        }
    });

}(
    Planting.module('plantingData')
));
