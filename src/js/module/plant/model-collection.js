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
            height: 0
        },

        initialize: function() {
            this
                .on('change:currentProjection', function() {
                    this.set('projectionValue', this.getProjection());
                })
                .set('projectionValue', this.getProjection(), { silent: true });
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

        initialize: function() {

            this.on('all', _.debounce(function() {
                this.engineDataStore()
                    .setObjects(this.toJSON());
            }), this);
        }
    });
}(
    Planting.module('core'),
    Planting.module('plant')
));
