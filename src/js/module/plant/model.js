(function (Core, Plant) {
   
   Plant.Model = Core.Model.extend({
        defaults: {
            x: null,
            y: null,
            scale: null,
            layerIndex: null,
            projection: 0,
            width: 0,
            height: 0,
            userActivity: false
        },

        getProjection: function() {

            return this.manifesto()
                    .getProjectionsFor(this.get('objectId'))[this.get('projection')];
        },

        setProjection: function(at) {
            var projections = this.get('projections');

            at = at > projections.length ? 0 : at;
            at = at < 0 ? projections.length : at;
            this.set('projection', at);
        }
   });

} (Planting.module('core'), Planting.module('plant')) );
