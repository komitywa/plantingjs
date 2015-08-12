Planting.Object.ObjectModel = Backbone.Model.extend({
    defaults: {
        projections: [],
        selectedProjection: 0,
        projectionValue: null
    },
    
    initialize: function() {

        this.on('change:selectedProjection', function() {
            this.set('projectionValue', this.getProjection());
        });
        this.set('projectionValue', this.getProjection(), { silent: true });
    },

    getProjection: function() {

        return this.get('projections')[this.get('selectedProjection')];
    },

    setProjection: function(at) {
        var projections = this.get('projections');
        
        at = at > projections.length ? 0 : at;
        at = at < 0 ? projections.length : at;

        this.set('selectedProjection', at);
    }
});
