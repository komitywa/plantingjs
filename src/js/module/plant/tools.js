import underscore from 'underscore';
import jquery from 'jquery';
import { View } from 'core';

let EVENT_MOUSEDOWN = false;
const PROJECTION_LENGTH = 10;

const PlantViewTools = View.extend({
  action: null,
  mouseDownEvent: null,

  template: underscore.template('\n' +
      '<span class="icon-trash"></span>\n' +
      '<span class="icon-resize"></span>\n' +
      '<div class="wrapper-rotate">\n' +
          '<span class="icon-menu-left"> </span>\n' +
          '<span class="degrees">0&deg;</span>\n' +
          '<span class="icon-menu-right"></span>\n' +
          '<span class="icon-loop"></span>\n' +
      '</div>\n' +
  ''),

  events: {
    'click .icon-trash': 'removeObject',
    'mousedown .icon-resize': 'resizeObject',
    'mousedown .icon-loop': 'rotateObject',
  },

  initialize: function initialize(opts) {
    this.render();
    this.parentView = opts.parent;
    this.model
      .on('change:userActivity', function(model, userActivity) {
        this.$el.toggleClass('user-active', userActivity);
      }, this);
  },

  render: function render() {
    this.$el.html(this.template());
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

  rotateObject: function(ev) {
    const plantedObject = this.parentView.$el;
    const plantedObjectProjections = this.model.get('projections');
    let newProjection = this.model.get('currentProjection');
    const buttonX = jquery(ev.target).offset().left;
    const self = this;

    EVENT_MOUSEDOWN = true;
    jquery('body').addClass('noselect rotate');
    plantedObject.addClass('plantingjs-active-object');

    function rotateOnMove(evt) {
      let currentProjection = self.model.get('currentProjection');
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
        self.model.set('currentProjection', newProjection);
      }
    }

    function finishRotation() {
      const plantedObjectContainer = plantedObject;
      if (EVENT_MOUSEDOWN && plantedObjectContainer.hasClass('plantingjs-active-object')) {
        jquery(document).off('mousemove', rotateOnMove);
        jquery(document).off('mouseup', finishRotation);
        jquery('body').removeClass('noselect rotate');
        plantedObjectContainer.removeClass('plantingjs-active-object');
        EVENT_MOUSEDOWN = false;
      }
    }

    jquery(document).on('mousemove', rotateOnMove);
    jquery(document).on('mouseup', finishRotation);
  },
});

module.exports = PlantViewTools;
