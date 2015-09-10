(function(Core, Toolbox) {

    Toolbox.Collection = Core.Collection.extend({
        model: Toolbox.Model
    });

}(
    Planting.module('core'),
    Planting.module('toolbox')
));
