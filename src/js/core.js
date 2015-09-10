(function(Core) {

    var coreMembers = {
        app: null,

        session: function() {

            return this.app.data.session;
        },

        manifesto: function() {

            return this.app.data.manifesto;
        }
    };

    function _setContext(options) {

        if (_.isObject(options) &&
            _.has(options, 'app')) {

            this.app = options.app;
        }
    }

    Core.View = Backbone.View.extend(
        _.extend({

            constructor: function(options) {
                _setContext.call(this, options);
                Backbone.View.call(this, options);
            }
        }, coreMembers)
    );

    Core.Model = Backbone.Model.extend(
        _.extend({

            constructor: function(modelAttrs, options) {
                _setContext.call(this, options);
                Backbone.Model.call(this, modelAttrs, options);
            },

            getCopy: function() {
                var data = Backbone.Model.prototype.get.apply(this, arguments);

                return _.map(data, _.clone);
            }
        }, coreMembers)
    );

    Core.Collection = Backbone.Collection.extend(
        _.extend({

            constructor: function(models, options) {
                _setContext.call(this, options);
                Backbone.Collection.call(this, models, options);
            }
        }, coreMembers)
    );

}(Planting.module('core')));
