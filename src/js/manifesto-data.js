import { Model } from 'core';
import Const from 'const';

export default Model.extend({
  constructor(data, options) {
    this.url = options.url;
    Model.call(this, data, options);
  },

  initialize() {
    this.on('fetch', () => {
      this.app.trigger(Const.EVENT.MANIFESTO_INITED, this);
    }, this);
  },

  getProjectionsFor(objectId) {
    const toolboxobjects = this.get('toolboxobjects')[objectId];
    return toolboxobjects.projections;
  },
});
