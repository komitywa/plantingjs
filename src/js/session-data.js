import underscore from 'underscore';
import { Model } from 'core';
import Const from 'const';
import PlantCollection from 'module/plant/collection';

export default Model.extend({

  ignoreObjectValues: [
    'userActivity',
    'projections',
  ],
  defaults: {
    lat: null,
    lng: null,
    zoom: null,
    heading: null,
    pitch: 0,
  },

  _objectsCollection: null,

  constructor(data, options) {
    this._objectsCollection = new PlantCollection(null, {
      app: options.app,
    });
    Model.call(this, data, options);
  },

  objects() {
    return this._objectsCollection;
  },

  setPanoCoords(data) {
    this.set(data);
  },

  toJSON() {
    const objects = this.objects().toJSON();

    return underscore.extend(Model.prototype.toJSON.call(this), {
      objects: underscore.omit(objects, this.ignoreObjectValues),
    });
  },

  save() {
    const data = this.toJSON();

    this.app.trigger(Const.Event.SAVE_REQUEST, data);

    if (underscore.isFunction(this.app.options.onSave)) {
      this.app.options.onSave.call(this, data);
    }
  },
});
