Planting.Plant.PlantObjectView = Backbone.View.extend({
    className: 'plantingjs-plantedobject-container ui-draggable ui-draggable-handle',
    template: _.template('\
            <img src="<%= projectionValue %>" />\
        '),

    events: {
        'dragstop': 'saveCoords'
    },

    initialize: function() {
        var serializedModel = this.model.toJSON();

        this.render(serializedModel);
        this.position(serializedModel.posLeft, serializedModel.posTop);
        this.$el.draggable();

        this.model.on('change:height change:width', this.resize, this);
    },

    render: function(data) {
        this.$el.html(this.template(data));
    },

    resize: function(model) {
        this.$el
            .css({
                top: model.get('posTop'),
                left: model.get('posLeft')
            })
            .children('img')
                .css({
                    height: model.get('height'), 
                    width: model.get('width')
                });
    },

    position: function(left, top) {
        this.$el.css({ left: left, top: top });
    },

    saveCoords: function(e, ui) {
        this.model.set({
            posLeft: ui.position.left,
            posTop: ui.position.top,
            offLeft: ui.offset.left,
            offTop: ui.offset.top
        });
    }
});
