import {isNull, isNumber, forEach, extend} from 'lodash';
import { Collection } from '../../core';
import PlantModel from './model';

export default Collection.extend({
  model: PlantModel,
  layers: [],

  initialize: function() {
    this.on('add', this.setLayer, this)
      .on('remove', this.removeLayer, this);
  },

  setLayer: function(model) {
    const layerIndex = model.get('layerIndex');

    if (isNull(layerIndex)) {
      model.set('layerIndex', this.layers.length);
      this.layers.push(model.cid);
    } else if (isNumber(layerIndex)) {
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
    forEach(this.layers, function(modelCid, index) {
      this.get(modelCid)
        .set('layerIndex', index);
    }, this);
  },

  parse: function(object) {
    extend(object, {
      x: object.position.x,
      y: object.position.y,
      objectId: object.object,
    });

    return object;
  },
});
