(function (Core, Toolbox) {

   Toolbox.View.Object = Core.View.extend({
        className: 'plantingjs-toolboxobject-item',
        template: _.template('\
            <div class="plantingjs-toolboxobject-prototype">\
                <img src="<%= projectionUrl %>">\
            \</div>\
            <div class="plantingjs-toolboxobject-draggable ui-draggable ui-draggable-handle"">\
                <img src="<%= projectionUrl %>">\
            </div>\
            '),

        events: {
            'dragstart': 'attachData'
        },

        initialize: function() {
            var $img;
            this.render(this.model);
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

        render: function(model) {

            this.$el
                .html(this.template(model.getRenderData()))
                .attr('data-cid', model.cid);
        },

        attachData: function() {
            this.$el.find('.plantingjs-toolboxobject-draggable')
                .data('model', this.model.clone().toJSON());
        }
    });


} (
    Planting.module('core'),
    Planting.module('toolbox')
));
