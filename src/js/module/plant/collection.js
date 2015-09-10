(function (Core, Plant) {
   
   Plant.Collection = Core.Collection.extend({
        model: Plant.Model,
        layers: [],

        initialize: function() {

            this.on('add', this.setLayer, this)
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
            this.reindexModelsLayer();
        },

        moveLayer: function(newIndex, oldIndex) {

            this.layers.splice(newIndex, 0, this.layers.splice(oldIndex, 1)[0]);
            this.reindexModelsLayer();
        },

        reindexModelsLayer: function() {
            
            _.each(this.layers, function(modelCid, index) {
                this.get(modelCid)
                    .set('layerIndex', index);
            }, this);
        },

        parse: function(object) {
            var objectId = object.object;

            _.extend(object, {
                scale: object.width,
                x: object.position.x,
                y: object.position.y,
                objectId: objectId
            });

            return object;
        }
   });

} (
    Planting.module('core'), 
    Planting.module('plant')) 
);
