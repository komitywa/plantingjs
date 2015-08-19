Planting.Toolbox.ObjectView = Backbone.View.extend({
    className: 'plantingjs-toolboxobject-item',
    template: _.template('\
        <div class="plantingjs-toolboxobject-prototype">\
            <img src="<%= projectionValue %>">\
        \</div>\
        <div class="plantingjs-toolboxobject-draggable ui-draggable ui-draggable-handle"">\
            <img src="<%= projectionValue %>">\
        </div>\
        '),

    events: {
        'dragstart': 'attachData'
    },

    initialize: function() {
        var data = _.extend( this.model.toJSON(), { cid: this.model.cid });
        var $img;

        this.render(data);
        $img = this.$el.find('img').first();
        this.$el.find('.plantingjs-toolboxobject-draggable')
            .draggable({
                containment: ".plantingjs-overlay" ,
                helper: 'clone',
                appendTo: '.plantingjs-overlay',
                zIndex: 1000
            });

        $img.on('load', function(e) {
            this.model.set({
                width: e.target.width,
                height: e.target.height
            });
        }.bind(this));
    },

    render: function(data) {

        this.$el.html(this.template(data));
    },

    attachData: function() {
        this.$el.find('.plantingjs-toolboxobject-draggable')
            .data('model', this.model.clone().toJSON());
    }
});
