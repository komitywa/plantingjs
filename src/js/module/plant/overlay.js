var _ = require('underscore');
var $ = require('jquery');
var Core = require('core');
var PlantViewObject = require('./object');
var Const = require('const');

var PlantViewOverlay = Core.View.extend({
    events: {
        'drop': 'plantObject'
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
            accept: ".plantingjs-toolboxobject-draggable"
        });
        this.app
            .on(Const.Event.START_PLANTING, this._init, this)
            .on(Const.Event.STATE_CHANGED, function(state) {

                if(state === Const.State.VIEWER) {
                    this._init();
                }

            }, this);
    },

    _init: function() {
        this.$el.show();
        this._width = this.$el.width();
        this._height = this.$el.height();
        $(window).on('resize', this.resizeHandler.bind(this));
    },

    addObject: function(model) {
        var newObject = new PlantViewObject({
            model: model,
            app: this.app,
            overlay: this
        });

        this.objects.push(newObject);
        this.$el.append(newObject.$el);
        this.listenToOnce(model, 'remove', this.removeObject.bind(this, newObject));
    },

    removeObject: function(object) {

        object.tools.remove();
        object.remove();
        this.objects = _.without(this.objects, _.findWhere(this.objects, {
            cid: object.cid
        }));
    },

    resizeHandler: function() {
        var oldH = this._height;
        var oldW = this._width;
        var newH = this.$el.height();
        var newW = this.$el.width();
        var scale = newW / oldW;

        this.objects.forEach(function(object) {

            var $container = object.$el;
            var $img = $container.children('img');
            var h = $img.height();
            var w = $img.width();
            var pos = $container.position();
            var t = pos.top;
            var l = pos.left * scale;

            t = newH / 2 + (t - oldH / 2) * scale
            $img.height(h * scale);
            $img.width(w * scale);
            $container.css({
                top: t,
                left: l
            });
        });
        this._width = newW;
        this._height = newH;

    },

    plantObject: function(e, ui) {
        var model = ui.draggable.data('model');
        var newModel = _.extend(model, {
            x: ui.position.left / this.width(),
            y: ui.position.top / (this.height() * 2) / this.width()
        });

        this.collection.add(newModel, {
            app: this.app
        });
    },

    width: function() {

        return this._width;
    },

    height: function() {

        return this._height;
    }
});
module.exports = PlantViewOverlay;
