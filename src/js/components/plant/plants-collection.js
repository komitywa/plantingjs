Planting.Plant.PlantsCollection = Planting.Object.ObjectsCollection.extend({
    model: Planting.Plant.PlantModel,

    rescaleObjects: function(overlayModel, scale) {
        this.invoke('rescale', overlayModel.get('height'), overlayModel.previous('height'), scale);
    }
});
