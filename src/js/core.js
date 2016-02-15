import Backbone from 'backbone';
import lodash from 'lodash';

const coreMembers = {
  app: null,
  session() {
    return this.app.data.session;
  },

  manifesto() {
    return this.app.data.manifesto;
  },
};

function _setContext(options) {
  if (lodash.isObject(options) && lodash.has(options, 'app')) {
    this.app = options.app;
  }
}

export const View = Backbone.View.extend(
    lodash.extend({
      constructor(options) {
        _setContext.call(this, options);
        Backbone.View.call(this, options);
      },
    }, coreMembers)
);

export const Model = Backbone.Model.extend(
    lodash.extend({
      constructor(modelAttrs, options) {
        _setContext.call(this, options);
        Backbone.Model.call(this, modelAttrs, options);
      },

      getCopy() {
        const data = Backbone.Model.prototype.get.apply(this, arguments);

        return lodash.map(data, lodash.clone);
      },
    }, coreMembers)
);

export const Collection = Backbone.Collection.extend(
    lodash.extend({
      constructor(models, options) {
        _setContext.call(this, options);
        Backbone.Collection.call(this, models, options);
      },
    }, coreMembers)
);
