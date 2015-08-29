(function (Core, Plant) {
   
   Plant.View.Object = Core.View.extend({
        className: 'plantingjs-plantedobject-container ui-draggable ui-draggable-handle',
        template: _.template('\
            <img src="<%= projectionValue %>" />\
            <div class="plantingjs-plantedobject-tools">\</div>\
        '),

        events: {
            'dragstop': 'saveCoords'
        },

        $img: null,

        initialize: function() {
            this.render(this.model);
            this.$el.children('img')
                .one('load', this.resize.bind(this, this.model));

            this.tools = new Plant.View.Tools({
                el: this.el.querySelector('.plantingjs-plantedobject-tools'),
                model: this.model,
                parent: this
            });
            this.$el.draggable({
                cancel: ".icon-loop, .icon-trash, .icon-resize"
            });
            this.model
                .on('change:scale', this.resize, this)
                .on('change:currentProjection', this.updateProjection, this);
        },

        render: function(model) {
            this.$el
                .html(this.template(model.toJSON())).attr('data-cid', model.cid)
                .css({
                    left: model.get('x'),
                    top: model.get('y')
                });

            this.$img = this.$el.children('img');

            return this;
        },

        resize: function(model) {
            this.$img.height(model.get('height') * model.get('scale'));
            this.$img.width(model.get('width') * model.get('scale'));

            return this;
        },

        updateProjection: function(model, currentProjection) {
            this.$img.attr('src', model.getProjection());
        },

        saveCoords: function(e, ui) {
            this.model.set({
                x: ui.position.left,
                y: ui.position.top
            });

            return this;
        }
    });


} (
    Planting.module('core'),
    Planting.module('plant')
));
