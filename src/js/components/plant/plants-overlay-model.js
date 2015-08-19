Planting.Plant.PlantsOverlayModel = Backbone.Model.extend({
   defaults: {
        height: 0,
        width: 0,
        scale: 1
   },

   initialize: function() {
        this.on('change:height change:width', this.updateScale, this);
   },

   updateScale: function() {
        var oldW = this.previous('width');
        var newW = this.get('width');
        var scale = newW / oldW;

        if (isFinite(scale)) {
            this.set('scale', scale);
        }
    }
});
