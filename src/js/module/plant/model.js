import { Model } from 'core';

const PlantModel = Model.extend({
  defaults: {
    x: null,
    y: null,
    scale: null,
    layerIndex: null,
    projection: 0,
    width: 0,
    height: 0,
    userActivity: false,
  },

  getProjection: function() {
    return this.manifesto()
      .getProjectionsFor(this.get('objectId'))[this.get('projection')];
  },

  setProjection: function(at_) {
    const projections = this.get('projections');
    let at = at_ > projections.length ? 0 : at_;
    at = at < 0 ? projections.length : at;
    this.set('projection', at);
  },
});
module.exports = PlantModel;
