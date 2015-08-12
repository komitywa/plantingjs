Planting.Toolbox.ObjectView = Backbone.View.extend({
    className: 'plantingjs-toolboxobject-item',
    template: _.template('\
        <div class="plantingjs-toolboxobject-prototype">\
            <img src="<%= projectionValue %>">\
        \</div>\
        <div class="plantingjs-toolboxobject-draggable ui-draggable ui-draggable-handle" data-cid="<%= cid %>">\
            <img src="<%= projectionValue %>">\
        </div>\
        '),

    initialize: function() {
        var data = _.extend( this.model.toJSON(), { cid: this.model.cid });

        this.render(data);
        this.$el.find('.plantingjs-toolboxobject-draggable')
            .draggable({
                containment: ".plantingjs-overlay" ,
                helper: 'clone',
                appendTo: '.plantingjs-overlay',
                zIndex: 1000
            });
    },

    render: function(data) {

        this.$el.html(this.template(data));
    }
});
