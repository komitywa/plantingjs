(function(Core, Plant) {
    Plant.Model = Core.Model.extend({
        defaults: {
            x: null,
            y: null,
            scale: 1,
            projections: [],
            currentProjection: 0,
            projectionValue: null,
            width: 0,
            height: 0,
            order: 0,
            userActivity: false
        },

        initialize: function() {
            this.on('change:currentProjection', function() {
                this.set('projectionValue', this.getProjection());
            });
            this.set('projectionValue', this.getProjection(), { silent: true });
        },

        getProjection: function() {

            return this.get('projections')[this.get('currentProjection')];
        },

        setProjection: function(at) {
            var projections = this.get('projections');
            
            at = at > projections.length ? 0 : at;
            at = at < 0 ? projections.length : at;

            this.set('currentProjection', at);
        }
    });

    Plant.Collection = Core.Collection.extend({
        model: Plant.Model,
        comparator: 'order',

        initialize: function() {

            this
                .on('all', _.debounce(function() {
                    this.engineDataStore()
                        .setObjects(this.toJSON());
                }), this)
                .on('add', this.setOrder, this);
        },

        setOrder: function(model) {

            model.set('order', this.length - 1);
        },

        move: function(currentOrder, nextOrder) {
            this.at(nextOrder).set('order', currentOrder);
            this.at(currentOrder).set('order', nextOrder);
        },

        moveDown: function(model) {
            var currentOrder = model.get('order');

            if (currentOrder < this.length -1) {
                this.move(currentOrder, currentOrder + 1);
            }
        },

        moveUp: function(model) {
            var currentOrder = model.get('order');

            if (currentOrder > 0) {
                this.move(currentOrder, currentOrder - 1);
            }
        }
    });
}(
    Planting.module('core'),
    Planting.module('plant')
));
