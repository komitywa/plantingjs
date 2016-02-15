import underscore from 'underscore';
import { View } from '../../core';
import PlantViewTools from '../plant/tools';
import Const from '../../const';

export default View.extend({
  className: 'plantingjs-plantedobject-container ui-draggable ui-draggable-handle',
  template: require('./object.hbs'),

  events: {
    'dragstart': 'dragstart',
    'dragstop': 'saveCoords',
    'mouseover': 'setUserActivity',
    'mouseleave': 'unsetUserActivity',
  },

  $img: null,

  initialize: function(options) {
    this.overlay = options.overlay;
    this.render();
    this.$img
        .one('load', function() {
          if (underscore.isNull(this.model.get('scale'))) {
            this.model.set('scale', this.$img.width() / this.overlay.width());
          }
          this.resize();
        }.bind(this));

    this.tools = new PlantViewTools({
      el: this.el.querySelector('.plantingjs-plantedobject-tools'),
      model: this.model,
      parent: this,
    });

    this.$el.draggable({
      cancel: '.icon-loop, .icon-trash, .icon-resize',
    });
    this.model
      .on('change:currentProjection', this.updateProjection, this)
      .on('change:layerIndex', this.setLayer, this);
  },

  render: function() {
    this.$el
      .html(this.template({
        projectionUrl: this.model.getProjection(),
      }))
      .attr('data-cid', this.model.cid)
      .css({
        left: this.overlay.width() * this.model.get('x'),
        top: this.overlay.height() / 2 + this.model.get('y') * this.overlay.width(),
        zIndex: this.model.get('layerIndex'),
      });

    this.$img = this.$el.children('img');

    return this;
  },

  setLayer: function(model) {
    this.$el.css('zIndex', model.get('layerIndex'));
  },

  resize: function() {
    this.$img.height(this.overlay.width() * this.model.get('scale'));
    this.$img.width(this.overlay.width() * this.model.get('scale'));
    return this;
  },

  updateProjection: function(model) {
    this.$img.attr('src', model.getProjection());
  },

  saveCoords: function(ev, ui) {
    this.model.set({
      x: ui.position.left,
      y: ui.position.top,
    });

    return this;
  },

  setUserActivity: function() {
    this.model.set('userActivity', true);
  },

  unsetUserActivity: function() {
    this.model.set('userActivity', false);
  },

  dragstart: function(ev) {
    if (this.app.getState() === Const.State.VIEWER) {
      ev.preventDefault();
    }
  },
});
