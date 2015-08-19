Planting.Plant.PlantsCollection = Planting.Object.ObjectsCollection.extend({
    model: Planting.Plant.PlantModel,

    rescaleObjects: function(overlayModel, scale) {

        this.each(function(plantModel) {
            var top = plantModel.get('posTop');
            var left = plantModel.get('posLeft');
            var oldH = plantModel.previous('height');

            plantModel.set({
                height: plantModel.get('height') * scale,
                width: plantModel.get('width') * scale,
                posLeft: left * scale,
                posTop: overlayModel.get('height') / 2 + (top - overlayModel.previous('height') / 2) * scale
            });
        });
    }
});
