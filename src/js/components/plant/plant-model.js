Planting.Plant.PlantModel = Planting.Object.ObjectModel.extend({
    defaults: {
        posLeft: 0,
        posTop: 0,
        offLeft: 0,
        offTop: 0
    },

    rescale: function(overlayHeight, overlayPrevHeight, scale) {
        this.set({
            height: this.get('height') * scale,
            width: this.get('width') * scale,
            posLeft: this.get('posLeft') * scale,
            posTop: overlayHeight / 2 + (this.get('posTop') - overlayPrevHeight / 2) * scale
        });
    }
});
