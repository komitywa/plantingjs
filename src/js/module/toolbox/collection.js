(function(Core, Toolbox, Plant) {

    Toolbox.Collection = Core.Collection.extend({
        model: Plant.Model
    });

}(
    Planting.module('core'),
    Planting.module('toolbox'),
    Planting.module('plant')
));
