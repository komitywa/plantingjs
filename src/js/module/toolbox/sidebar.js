(function (Core, EVENT, Toolbox) {
   
   Toolbox.View.Sidebar = Core.View.extend({
        className: 'plantingjs-toolbox',
        template: _.template('\
            <div class="plantingjs-toolbox-toggle"></div>\
            <div class="plantingjs-savebtn">SAVE</div>\
            <div class="plantingjs-toolboxobject-container"></div>\
        '),
        events: {
            'click .plantingjs-savebtn': 'onSave'
        },

        constructor: function(obj) {
            this.collection = new Toolbox.Collection(obj.manifesto.toolboxobjects, {
                app: this.app
            });
            Core.View.call(this, obj);
        },

        initialize: function(obj) {
            this.objects = this.collection.map(function(toolboxObjectModel) {

                return new Toolbox.View.Object({
                    model: toolboxObjectModel,
                    app: this.app
                });
            }, this);
            this.app.on(EVENT.START_PLANTING, function(visible) {
                this.$el.show();
            }, this);

            this.render( this.objects );
        },

        render: function( objects ) {
            var $template = $('<div />').append(this.template());
            var $list = $template.find('.plantingjs-toolboxobject-container');

            objects.forEach(function(object) {
                $list.append(object.$el);
            });
            this.$el.append($template);
        },

        onSave: function() {
            this.app.trigger(EVENT.SAVE_REQUEST);
            this.engineDataStore()
                .save();
        }
    });


} (
    Planting.module('core'),
    Planting.Event,
    Planting.module('toolbox')
));
