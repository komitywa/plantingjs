(function(Core, Plant) {
    Plant.Model = Core.Model.extend({
        defaults: {
            x: null,
            y: null,
            scale: 1,
            layerIndex: null,
            projections: [],
            currentProjection: 0,
            width: 0,
            height: 0,
            order: 0,
            userActivity: false
        },

        getRenderData: function() {

            return _.extend({
                projectionUrl: this.getProjection()
            }, this.attributes);
        },

        getProjection: function() {

            return this.get('projections')[this.get('currentProjection')];
        },

        setProjection: function(at) {
            var projections = this.get('projections');

            at = at > projections.length ? 0 : at;
            at = at < 0 ? projections.length : at;

            this.set('currentProjection', at);
        }
    });

    Plant.Collection = Core.Collection.extend({
        model: Plant.Model,
        comparator: 'order',
        layers: [],

        initialize: function() {

            this
                .on('all', _.debounce(function() {
                    this.engineDataStore()
                        .setObjects(this.toJSON());
                }), this)
                .on('add', this.setLayer, this)
                .on('remove', this.removeLayer, this);
        },

        setLayer: function(model) {
            var layerIndex = model.get('layerIndex');

            if (_.isNull(layerIndex)) {
                model.set('layerIndex', this.layers.length);
                this.layers.push(model.cid);

            } else if (_.isNumber(layerIndex)) {

                this.layers.splice(layerIndex, 0, model.cid);
            }
        },

        removeLayer: function(model) {
            var layerIndex = model.get('layerIndex');

            this.layers.splice(layerIndex, 1);
            this.reindexLayers();
        },

        moveLayer: function(newIndex, oldIndex) {

            this.layers.splice(newIndex, 0, this.layers.splice(oldIndex, 1)[0]);
            this.reindexLayers();
        },

        reindexLayers: function() {
            _.each(this.layers, function(modelCid, index) {
                this.get(modelCid)
                    .set('layerIndex', index);
            }, this);
        }
    });
}(
    Planting.module('core'),
    Planting.module('plant')
));
