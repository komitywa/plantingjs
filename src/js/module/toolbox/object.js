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
            
            this.render();
            $img = this.$el.find('img').first();
            this.$el.find('.plantingjs-toolboxobject-draggable')
                .draggable({
                    containment: ".plantingjs-overlay" ,
                    helper: 'clone',
                    appendTo: '.plantingjs-overlay',
                    zIndex: 1000
                });
        },

        render: function() {

            this.$el
                .html(this.template({
                    projectionUrl: this.model.getProjection()
                }))
                .attr('data-cid', this.model.cid);
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
