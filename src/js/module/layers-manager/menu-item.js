import underscore from 'underscore';
import Core from 'core';

const LayersManagerViewItem = Core.View.extend({
  className: 'plantingjs-layer-item',
  template: underscore.template('\n' +
      '<div class="plantingjs-layer-col plantingjs-layer-info">\n' +
          '<span><%= cid %></span>\n' +
      '</div>\n' +
      '<div class="plantingjs-layer-col plantingjs-layer-arrows">\n' +
          '<button class="plantingjs-layer-item-up js-dir-up">UP</button>\n' +
          '<button class="plantingjs-layer-item-down js-dir-down">DOWN</button>\n' +
      '</div>\n' +
  ''),

  events: {
    'click .js-dir-down': 'moveDown',
    'click .js-dir-up': 'moveUp',
    'mouseover': 'setUserActivity',
    'mouseleave': 'unsetUserActivity',
  },
  $parent: null,

  initialize: function(options) {
    this.$parent = options.$parent;
    this.render(this.model);
    this.model
      .on('change:userActivity', function(model, userActivity) {
        this.$el.toggleClass('user-active', userActivity);
      }, this)
      .on('change:layerIndex', this.reindex, this);
  },

  render: function(model) {
    this.$el.html(this.template({
      cid: model.cid,
    }));
    this.$parent.append(this.$el);
  },

  moveUp: function() {
    const layerIndex = this.model.get('layerIndex');

    this.collection.moveLayer(layerIndex + 1, layerIndex);
  },

  moveDown: function() {
    const layerIndex = this.model.get('layerIndex');

    this.collection.moveLayer(layerIndex - 1, layerIndex);
  },

  reindex: function(model) {
    const index = model.get('layerIndex');
    this.$parent
      .children()
      .eq(index).after(this.$el);
  },

  setUserActivity: function() {
    this.model.set('userActivity', true);
  },

  unsetUserActivity: function() {
    this.model.set('userActivity', false);
  },
});
module.exports = LayersManagerViewItem;
