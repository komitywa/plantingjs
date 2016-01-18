import underscore from 'underscore';
import jquery from 'jquery';
import { View } from '../../core';
import PlantViewObject from './object';
import Const from '../../const';

const PlantViewOverlay = View.extend({
  events: {
    'drop': 'plantObject',
  },
  _width: null,
  _height: null,

  initialize: function() {
    this.objects = [];
    this.collection
      .on('add', this.addObject, this)
      .on('reset', function(collection) {
        collection.each(this.addObject, this);
      }, this);
    this.$el.droppable({
      accept: '.plantingjs-toolboxobject-draggable',
    });
    this.app
      .on(Const.Event.START_PLANTING, this._init, this)
      .on(Const.Event.STATE_CHANGED, function(state) {
        if (state === Const.State.VIEWER) {
          this._init();
        }
      }, this);
  },

  _init: function() {
    this.$el.show();
    this._width = this.$el.width();
    this._height = this.$el.height();
    jquery(window).on('resize', this.resizeHandler.bind(this));
  },

  addObject: function(model) {
    const newObject = new PlantViewObject({
      model: model,
      app: this.app,
      overlay: this,
    });

    this.objects.push(newObject);
    this.$el.append(newObject.$el);
    this.listenToOnce(model, 'remove', this.removeObject.bind(this, newObject));
  },

  removeObject: function(object) {
    object.tools.remove();
    object.remove();
    this.objects = underscore.without(this.objects, underscore.findWhere(this.objects, {
      cid: object.cid,
    }));
  },

  resizeHandler: function() {
    const oldH = this._height;
    const oldW = this._width;
    const newH = this.$el.height();
    const newW = this.$el.width();
    const scale = newW / oldW;

    this.objects.forEach(function(object) {
      const $container = object.$el;
      const $img = $container.children('img');
      const height = $img.height();
      const width = $img.width();
      const pos = $container.position();
      let top = pos.top;
      const left = pos.left * scale;

      top = newH / 2 + (top - oldH / 2) * scale;
      $img.height(height * scale);
      $img.width(width * scale);
      $container.css({
        top: top,
        left: left,
      });
    });
    this._width = newW;
    this._height = newH;
  },

  plantObject: function(ev, ui) {
    const model = ui.draggable.data('model');
    const newModel = underscore.extend(model, {
      x: ui.position.left / this.width(),
      y: ui.position.top / (this.height() * 2) / this.width(),
    });

    this.collection.add(newModel, {
      app: this.app,
    });
  },

  width: function() {
    return this._width;
  },

  height: function() {
    return this._height;
  },
});

module.exports = PlantViewOverlay;
