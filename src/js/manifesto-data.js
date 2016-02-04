import { Model } from './core';

export default Model.extend({
  constructor(data, options) {
    this.url = options.url;
    Model.call(this, data, options);
  },

  getProjectionsFor(objectId) {
    const toolboxobjects = this.get('toolboxobjects')[objectId];
    return toolboxobjects.projections;
  },
});
