Planting.Main.MainOverlayView = Backbone.View.extend({
    className: 'plantingjs-overlay ui-droppable',
    events: {
        'drop': 'onDrop'
    },
    objects: [],

    initialize: function(obj) {
        this.parent = obj.parent;
        this.$el.droppable({
            accept: ".plantingjs-toolboxobject-draggable"
        });

        Planting.Mediator.on(Planting.Event.START_PLANTING, function() {
            this.$el.show();
        }, this);

        this.collection.on('add', this.addObject, this);
    },

    addObject: function(model) {
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
