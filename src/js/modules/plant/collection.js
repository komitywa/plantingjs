import underscore from 'underscore';
import { Collection } from '../../core';
import PlantModel from './model';


const PlantCollection = Collection.extend({
  model: PlantModel,
  layers: [],

  initialize: function() {
    this.on('add', this.setLayer, this)
      .on('remove', this.removeLayer, this);
  },

  setLayer: function(model) {
    const layerIndex = model.get('layerIndex');

    if (underscore.isNull(layerIndex)) {
      model.set('layerIndex', this.layers.length);
      this.layers.push(model.cid);
    } else if (underscore.isNumber(layerIndex)) {
      this.layers.splice(layerIndex, 0, model.cid);
    }
  },

  removeLayer: function(model) {
    const layerIndex = model.get('layerIndex');

    this.layers.splice(layerIndex, 1);
    this.reindexModelsLayer();
  },

  moveLayer: function(newIndex, oldIndex) {
    this.layers.splice(newIndex, 0, this.layers.splice(oldIndex, 1)[0]);
    this.reindexModelsLayer();
  },

  reindexModelsLayer: function() {
    underscore.each(this.layers, function(modelCid, index) {
      this.get(modelCid)
        .set('layerIndex', index);
    }, this);
  },

  parse: function(object) {
    const objectId = object.object;

    underscore.extend(object, {
      scale: object.width,
      x: object.position.x,
      y: object.position.y,
      objectId: objectId,
    });

    return object;
  },
});
module.exports = PlantCollection;
