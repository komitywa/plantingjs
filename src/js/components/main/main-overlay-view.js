Planting.Main.MainOverlayView = Backbone.View.extend({
    className: 'plantingjs-overlay ui-droppable',
    events: {
        'drop': 'onDrop'
    },
    objects: [],

    initialize: function(obj) {
        this.model = new Planting.Main.MainModel();
        this.parent = obj.parent;
        this.$el.droppable({
            accept: ".plantingjs-toolboxobject-draggable"
        });
        Planting.Mediator.on(Planting.Event.START_PLANTING, function() { 
            this.$el.show();
            this.setWindowSize(this.$el.height(), this.$el.width());
        }, this);
        this.collection.on('add', this.addObject, this);
        $(window).on('resize', _.throttle(function() {
            this.setWindowSize(this.$el.height(), this.$el.width());
        }.bind(this), 500));
        this.model.on('change:windowWidth change:heightWidth', this.updateObjectSize, this);
    },

    setWindowSize: function(height, width) {
        this.model.set({
            windowHeight: height,
            windowWidth: width
        });
    },

    updateObjectSize: function(model) {
        var oldW = model.previous('windowWidth');
        var oldH = model.previous('windowHeight');
        var newW = model.get('windowWidth');
        var newH = model.get('windowHeight');
        var scale = newW / oldW;

        if (!isFinite(scale)) {
            return;
        }

        this.collection.each(function(model) {
            var h = model.get('height');
            var w = model.get('width');

            model.set({
                height: h * scale,
                width: w * scale
            });
            // var h = pe.plantedobjects[j].img.height()
            // var w = pe.plantedobjects[j].img.width();
            // pe.plantedobjects[j].img.height(h * scale);
            // pe.plantedobjects[j].img.width(w * scale);

            // var pos = pe.plantedobjects[j].container.position();
            // var t = pos.top;
            // var l = pos.left;
            // l = l * scale;
            // t = newH / 2 + (t - oldH / 2) * scale;
            // pe.plantedobjects[j].container.css({ top: t, left: l});
            
        });
    },

    addObject: function(model) {
        console.log(model);
        var objectView = new Planting.Main.MainObjectView({model: model});
        
        this.objects.push(objectView);
        this.$el.append(objectView.$el);
    },

    onDrop: function(e, ui) {
        var cid = ui.draggable.data('cid');
        var model = this.parent.toolbox.collection.get(cid);
        var newModel = _.extend(model.toJSON(), {
            position: ui.position,
            offset: ui.offset
        });

        this.collection.add(newModel);
    }
});
