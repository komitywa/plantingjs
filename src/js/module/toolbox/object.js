import { View } from 'core';

export default View.extend({
  className: 'plantingjs-toolboxobject-item',
  template: require('./object.hbs'),
  events: {
    'dragstart': 'attachData',
  },

  initialize() {
    this.render();
    this.$el
      .find('.plantingjs-toolboxobject-draggable')
      .draggable({
        containment: '.plantingjs-overlay',
        helper: 'clone',
        appendTo: '.plantingjs-overlay',
        zIndex: 1000,
      });
  },

  render() {
    this.$el
      .html(this.template({
        projectionUrl: this.model.getProjection(),
      }))
      .attr('data-cid', this.model.cid);
  },

  attachData() {
    const modelData = this.model.clone().toJSON();
    this.$el
      .find('.plantingjs-toolboxobject-draggable')
      .data('model', modelData);
  },
});
