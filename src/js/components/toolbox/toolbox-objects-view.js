Planting.Toolbox.ToolboxObjectsView = Backbone.View.extend({
    className: 'plantingjs-toolbox',
    template: _.template('\
        <div class="plantingjs-toolbox-toggle"></div>\
        <div class="plantingjs-savebtn">SAVE</div>\
        <div class="plantingjs-toolboxobject-container"></div>\
    '),
    events: {
        'click .plantingjs-savebtn': 'onSave'
    },

    initialize: function(obj) {
        this.objects = this.collection.map(function(toolboxObjectModel) {
            return new Planting.Toolbox.ObjectView({
                model: toolboxObjectModel
            });
        });
        Planting.Mediator.on(Planting.Event.START_PLANTING, function(visible) {
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
        Planting.Mediator.trigger(Planting.Event.SAVE_REQUEST);
    }
});
