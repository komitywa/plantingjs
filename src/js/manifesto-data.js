(function(Core, EVENT, ManifestoData) {

    ManifestoData.Model = Core.Model.extend({

        constructor: function(data, options) {

            this.url = options.url;
            Core.Model.call(this, data, options);
        },

        initialize: function() {

            this.on('fetch', function() {

                this.app.trigger(EVENT.MANIFESTO_INITED, this);
            }, this);
        },

        getProjectionsFor: function(objectId) {
            var toolboxobjects = this.get('toolboxobjects')[objectId];

            return toolboxobjects.projections;
        }
    });

}(
    Planting.module('core'),
    Planting.Event,
    Planting.module('manifestoData')
));
