Planting.Plant.PlantsOverlayView = Backbone.View.extend({
    className: 'plantingjs-overlay ui-droppable',
    events: {
        'drop': 'onDrop'
    },

    constructor: function() {

        this.model = new Planting.Plant.PlantsOverlayModel();
        Backbone.View.apply(this, arguments);
    },

    initialize: function() {

        this.objects = [];
        this.collection = new Planting.Plant.PlantsCollection();
        this.$el.droppable({
            accept: ".plantingjs-toolboxobject-draggable"
        });
        Planting.Mediator.on(Planting.Event.START_PLANTING, function() { 
            this.$el.show();
            this.storeOverlayProps();
        }, this);
        this.collection.on('add', this.addObject, this);
        this.model.on('change:scale', this.collection.rescaleObjects, this.collection);
        $(window).on('resize', this.storeOverlayProps.bind(this));
    },

    addObject: function(model) {
        var newObject = new Planting.Plant.PlantObjectView({ model: model });
        
        this.objects.push(newObject);
        this.$el.append(newObject.$el);
    },

    storeOverlayProps: function() {
        this.model.set({
            height: this.$el.height(),
            width: this.$el.width()
        });
    },

    onDrop: function(e, ui) {
        var model = ui.draggable.data('model');
        var newModel = _.extend(model, {
            posLeft: ui.position.left,
            posTop: ui.position.top,
            offLeft: ui.offset.left,
            offTop: ui.offset.top
        });
        
        this.collection.add(newModel);
    }
});
