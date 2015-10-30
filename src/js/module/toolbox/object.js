import { View } from 'core';

const ToolboxViewObject = View.extend({
  className: 'plantingjs-toolboxobject-item',
  template: require('./object.hbs'),

  events: {
    'dragstart': 'attachData',
  },

  initialize: function() {
    this.render();
    this.$el.find('.plantingjs-toolboxobject-draggable')
      .draggable({
        containment: '.plantingjs-overlay',
        helper: 'clone',
        appendTo: '.plantingjs-overlay',
        zIndex: 1000,
      });
  },

  render: function() {
    this.$el
      .html(this.template({
        projectionUrl: this.model.getProjection(),
      }))
      .attr('data-cid', this.model.cid);
  },

  attachData: function() {
    this.$el.find('.plantingjs-toolboxobject-draggable')
      .data('model', this.model.clone().toJSON());
  },
});
module.exports = ToolboxViewObject;
