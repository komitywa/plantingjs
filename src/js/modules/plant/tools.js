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
    this.model
      .on('change:userActivity', (model, userActivity) =>
        this.$el.toggleClass('user-active', userActivity));
    this.render();
  },

  render: function render() {
    this.$el.html(this.template({ options: this.options }));
  },

  removeObject: function removeObject() {
    this.model.collection.remove(this.model);
  },

  resizeObject: function resizeObject(ev) {
    const plantedObject = this.parentView.$el;
    const scale = this.model.get('scale');
    let cssScale;
    let resizeOnDrag;
    let finishResizing;
    const buttonX = jquery(ev.target).offset().left;
    const self = this;

    EVENT_MOUSEDOWN = true;
    jquery('body').addClass('noselect resize');
    plantedObject.addClass('plantingjs-active-object');

    resizeOnDrag = function(evt) {
      if (!EVENT_MOUSEDOWN) return;
      if (plantedObject.hasClass('plantingjs-active-object')) {
        const buttonCursorDistance = buttonX - evt.pageX;

        if (buttonCursorDistance === 0) {
          cssScale = scale;
        } else if (buttonCursorDistance < 0) {
          cssScale = scale - Math.abs(buttonCursorDistance / 100);
        } else if (buttonCursorDistance > 0) {
          cssScale = scale + buttonCursorDistance / 100;
        }

        if (cssScale > 0.2) {
          self.model.set('scale', cssScale);
        }
      }
    };
    finishResizing = function() {
      const plantedObjectContainer = plantedObject;
      if (EVENT_MOUSEDOWN && plantedObjectContainer.hasClass('plantingjs-active-object')) {
        jquery('body').removeClass('noselect resize');
        plantedObjectContainer.removeClass('plantingjs-active-object');
        jquery(document).off('mousemove', resizeOnDrag);
        jquery(document).off('mouseup', finishResizing);
        EVENT_MOUSEDOWN = false;
      }
    };

    jquery(document).on('mousemove', resizeOnDrag);
    jquery(document).on('mouseup', finishResizing);
  },

  rotateObject: function() {
    const plantedObject = this.parentView.$el;
    EVENT_MOUSEDOWN = true;
    jquery('body').addClass('noselect rotate');
    plantedObject.addClass('plantingjs-active-object');

    jquery(document).on('mousemove', jquery.proxy(this.rotateOnMove, this));
    jquery(document).on('mouseup', jquery.proxy(this.finishRotation, this));
  },

  rotateOnMove: function(evt) {
    const buttonX = this.$('.icon-loop').offset().left;
    const plantedObject = this.parentView.$el;
    const plantedObjectProjections = this.model.get('projections');
    let newProjection = this.model.get('currentProjection');
    let currentProjection = this.model.get('currentProjection');
    const buttonCursorDistance = evt.pageX - buttonX;
    let projectionsToRotate = (Math.abs(buttonCursorDistance) - Math.abs(buttonCursorDistance) % PROJECTION_LENGTH) / PROJECTION_LENGTH;
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

  finishRotation: function() {
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

