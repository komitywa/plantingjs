import jquery from 'jquery';
import { View } from '../../core';

let EVENT_MOUSEDOWN = false;
const PROJECTION_LENGTH = 10;

export default View.extend({
  action: null,
  mouseDownEvent: null,

  template: require('./tools.hbs'),

  events: {
    'click .icon-trash': 'removeObject',
    'mousedown .icon-resize': 'resizeObject',
    'mousedown .icon-loop': 'rotateObject',
  },

  initialize: function initialize({ parent, options }) {
    this.parentView = parent;
    this.options = options;
    this.listenTo(this.model, 'change:userActivity',
      (model, userActivity) =>
        this.$el.toggleClass('user-active', userActivity));
    this.render();
  },

  render: function render() {
    this.$el.html(this.template({ options: this.options }));
  },

  removeObject: function removeObject() {
    this.model.collection.remove(this.model);
  },

  resizeObject: function resizeObject() {
    const plantedObject = this.parentView.$el;

    EVENT_MOUSEDOWN = true;
    jquery('body').addClass('noselect resize');
    plantedObject.addClass('plantingjs-active-object');
    this.buttonX = this.$('.icon-resize').offset().left;

    jquery(document).on('mousemove', jquery.proxy(this.resizeOnDrag, this));
    jquery(document).on('mouseup', jquery.proxy(this.finishResizing, this));
  },

  resizeOnDrag: function resizeOnDrag(evt) {
    if (!EVENT_MOUSEDOWN) return;
    const plantedObject = this.parentView.$el;
    const scale = this.model.get('scale');
    let cssScale;
    if (plantedObject.hasClass('plantingjs-active-object')) {
      const buttonCursorDistance = this.buttonX - evt.pageX;

      if (buttonCursorDistance === 0) {
        cssScale = scale;
      } else if (buttonCursorDistance < 0) {
        cssScale = scale - Math.abs(buttonCursorDistance / 100);
      } else if (buttonCursorDistance > 0) {
        cssScale = scale + buttonCursorDistance / 100;
      }

      if (cssScale > 0.2) {
        this.model.set('scale', cssScale);
      }
    }
  },

  finishResizing: function finishResizing() {
    const plantedObject = this.parentView.$el;
    if (EVENT_MOUSEDOWN &&
      plantedObject.hasClass('plantingjs-active-object')) {
      jquery('body').removeClass('noselect resize');
      plantedObject.removeClass('plantingjs-active-object');
      jquery(document).off('mousemove', jquery.proxy(this.resizeOnDrag, this));
      jquery(document).off('mouseup', jquery.proxy(this.finishResizing, this));
      EVENT_MOUSEDOWN = false;
    }
  },

  rotateObject: function rotateObject() {
    const plantedObject = this.parentView.$el;
    EVENT_MOUSEDOWN = true;
    jquery('body').addClass('noselect rotate');
    plantedObject.addClass('plantingjs-active-object');
    this.buttonX = this.$('.icon-loop').offset().left;

    jquery(document).on('mousemove', jquery.proxy(this.rotateOnMove, this));
    jquery(document).on('mouseup', jquery.proxy(this.finishRotation, this));
  },

  rotateOnMove: function rotateOnMove(evt) {
    const plantedObject = this.parentView.$el;
    const plantedObjectProjections = this.model.get('projections');
    let newProjection = this.model.get('currentProjection');
    let currentProjection = this.model.get('currentProjection');
    const buttonCursorDistance = evt.pageX - this.buttonX;
    let projectionsToRotate = (
      Math.abs(buttonCursorDistance) - Math.abs(buttonCursorDistance)
      % PROJECTION_LENGTH) / PROJECTION_LENGTH;
    if (!EVENT_MOUSEDOWN) return;
    if (plantedObject.hasClass('plantingjs-active-object')) {
      projectionsToRotate %= plantedObjectProjections.length;
      if (buttonCursorDistance > 0) {
        currentProjection += projectionsToRotate;
        currentProjection %= plantedObjectProjections.length;
      } else if (buttonCursorDistance < 0) {
        if (currentProjection <= projectionsToRotate) {
          currentProjection += plantedObjectProjections.length;
        }
        currentProjection -= projectionsToRotate;
        currentProjection--;
      }
      newProjection = currentProjection;
      this.model.set('currentProjection', newProjection);
    }
  },

  finishRotation: function finishRotation() {
    const plantedObject = this.parentView.$el;
    if (EVENT_MOUSEDOWN && plantedObject.hasClass('plantingjs-active-object')) {
      jquery(document).off('mousemove', this.rotateOnMove);
      jquery(document).off('mouseup', this.finishRotation);
      jquery('body').removeClass('noselect rotate');
      plantedObject.removeClass('plantingjs-active-object');
      EVENT_MOUSEDOWN = false;
    }
  },

});
