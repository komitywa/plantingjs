import Core from 'core';
import Const from 'const';

const ManifestoDataModel = Core.Model.extend({
  constructor: function(data, options) {
    this.url = options.url;
    Core.Model.call(this, data, options);
  },

  initialize: function() {
    this.on('fetch', function() {
      this.app.trigger(Const.EVENT.MANIFESTO_INITED, this);
    }, this);
  },

  getProjectionsFor: function(objectId) {
    const toolboxobjects = this.get('toolboxobjects')[objectId];
    return toolboxobjects.projections;
  },
});
module.exports = ManifestoDataModel;
