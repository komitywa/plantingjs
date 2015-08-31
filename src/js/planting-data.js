(function(Core, EVENT, PlantingData) {

    PlantingData.Model = Core.Model.extend({

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

        setPanoCoords: function(data) {

            this.set(data);
        },

        setObjects: function(objectsArray) {
            var objects = _.map(objectsArray, function(object) {

                return _.omit(object, this.ignoreObjectValues);
            }, this);

            this.set('objects', objects);
        },

        save: function() {
            var data = this.toJSON();

            this.app.trigger(EVENT.SAVE_REQUEST, data);

            if (_.isFunction(this.app.options.onSave)) {
                
                this.app.options.onSave.call(this, data);
            }
        }
    });

}(
    Planting.module('core'),
    Planting.Event,
    Planting.module('plantingData')
));
