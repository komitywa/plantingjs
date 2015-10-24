var _ = require('underscore');
var $ = require('jquery');
var Core = require('core');

var EVENT_MOUSEDOWN = false;
var PROJECTION_LENGTH = 10;

var PlantViewTools = Core.View.extend({
    action: null,
    mouseDownEvent: null,

    template: _.template('\
        <span class="icon-trash"></span>\
        <span class="icon-resize"></span>\
        <div class="wrapper-rotate">\
            <span class="icon-menu-left"> </span>\
            <span class="degrees">0&deg;</span>\
            <span class="icon-menu-right"></span>\
            <span class="icon-loop"></span>\
        </div>\
    '),

    events: {
        'click .icon-trash': 'removeObject',
        'mousedown .icon-resize': 'resizeObject',
        'mousedown .icon-loop': 'rotateObject'
    },

    initialize: function(opts) {
        this.render();
        this.parentView = opts.parent;
        this.model
            .on('change:userActivity', function(model, userActivity) {
                this.$el.toggleClass('user-active', userActivity);
            }, this);
    },

    render: function() {
        this.$el.html(this.template());
    },

    removeObject: function() {
        this.model.collection.remove(this.model);
    },

    resizeObject: function(e) {
        EVENT_MOUSEDOWN = true;
        $('body').addClass('noselect resize');
        var plantedObject = this.parentView.$el,
            scale = this.model.get('scale'),
            cssScale,
            resizeOnDrag,
            finishResizing,
            buttonX = $(e.target).offset().left;
        var self = this;

        var h = this.parentView.$img.height();
        var w = this.parentView.$img.width();

        plantedObject.addClass('plantingjs-active-object');

        resizeOnDrag = function (e) {
            if (!EVENT_MOUSEDOWN) return;
            if (plantedObject.hasClass('plantingjs-active-object')) {
                var buttonCursorDistance = buttonX - e.pageX;

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
        finishResizing = function (e) {
            var plantedObjectContainer = plantedObject;
            if (EVENT_MOUSEDOWN && plantedObjectContainer.hasClass('plantingjs-active-object')) {
                $('body').removeClass('noselect resize');
                plantedObjectContainer.removeClass('plantingjs-active-object');
                $(document).off('mousemove', resizeOnDrag);
                $(document).off('mouseup', finishResizing);
                EVENT_MOUSEDOWN = false;
            }
        };

        $(document).on('mousemove', resizeOnDrag);
        $(document).on('mouseup', finishResizing);
    },

    rotateObject: function(e) {
        EVENT_MOUSEDOWN = true;
        $('body').addClass('noselect rotate');

        var plantedObject = this.parentView.$el;
        var plantedObjectProjections = this.model.get('projections');
        var newProjection = this.model.get('currentProjection');
        var buttonX = $(e.target).offset().left;
        var self = this;

        plantedObject.addClass('plantingjs-active-object');

        function rotateOnMove(e) {
            if (!EVENT_MOUSEDOWN) return;
            if (plantedObject.hasClass('plantingjs-active-object')) {
                var currentProjection = self.model.get('currentProjection');
                var buttonCursorDistance = e.pageX - buttonX;

                var projectionsToRotate = (Math.abs(buttonCursorDistance) - Math.abs(buttonCursorDistance) % PROJECTION_LENGTH) / PROJECTION_LENGTH;
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

        function finishRotation(e) {
            var plantedObjectContainer = plantedObject;
            if (EVENT_MOUSEDOWN && plantedObjectContainer.hasClass('plantingjs-active-object')) {
                $(document).off('mousemove', rotateOnMove);
                $(document).off('mouseup', finishRotation);
                $('body').removeClass('noselect rotate');
                plantedObjectContainer.removeClass('plantingjs-active-object');
                EVENT_MOUSEDOWN = false;
            }
        }

        $(document).on('mousemove', rotateOnMove);
        $(document).on('mouseup', finishRotation);
    },
});
module.exports = PlantViewTools;
