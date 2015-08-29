(function(Core, EVENT, Plant) {

    Plant.View.Overlay = Core.View.extend({
        events: {
            'drop': 'plantObject'
        },
        _width: null,
        _height: null,

        initialize: function() {
            this.objects = [];
            this.collection = new Plant.Collection(null, {
                app: this.app
            });
            this.collection.on('add', this.addObject, this);
            this.$el.droppable({
                accept: ".plantingjs-toolboxobject-draggable"
            });
            this.app.on(EVENT.START_PLANTING, function() {
                this.$el.show();
                this._width = this.$el.width();
                this._height = this.$el.height();
                $(window).on('resize', this.resizeHandler.bind(this));
            }, this);
        },

        addObject: function(model) {
            var newObject = new Plant.View.Object({
                model: model,
                app: this.app
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
                x: ui.position.left,
                y: ui.position.top
            });

            this.collection.add(newModel);
        }
    });

}(
    Planting.module('core'),
    Planting.Event,
    Planting.module('plant')
));
