Planting.Main.MainObjectView = Backbone.View.extend({
    className: 'plantingjs-plantedobject-container ui-draggable ui-draggable-handle',
    
    initialize: function() {
        this.render(this.model.toJSON());
    },

    render: function(data) {
        this.$el.html('<img src="' + data.projectionValue + '">');
        this.$el.css({ left: data.position.left, top: data.position.top });
    }
});
