import Backbone from 'backbone';
import {isObject, has, extend, map, clone} from 'lodash';

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
  if (isObject(options) && has(options, 'app')) {
    this.app = options.app;
  }
}

export const View = Backbone.View.extend(
    extend({
      constructor(options) {
        _setContext.call(this, options);
        Backbone.View.call(this, options);
      },
    }, coreMembers)
);

export const Model = Backbone.Model.extend(
    extend({
      constructor(modelAttrs, options) {
        _setContext.call(this, options);
        Backbone.Model.call(this, modelAttrs, options);
      },

      getCopy() {
        const data = Backbone.Model.prototype.get.apply(this, arguments);

        return map(data, clone);
      },
    }, coreMembers)
);

export const Collection = Backbone.Collection.extend(
    extend({
      constructor(models, options) {
        _setContext.call(this, options);
        Backbone.Collection.call(this, models, options);
      },
    }, coreMembers)
);
