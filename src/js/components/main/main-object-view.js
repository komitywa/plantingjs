Planting.Main.MainObjectView = Backbone.View.extend({
    className: 'plantingjs-plantedobject-container ui-draggable ui-draggable-handle',

    initialize: function() {
        var $img;

        this.render(this.model.toJSON());
        $img = this.$el.find('img');
        this.model.set({
            width: $img.width(),
            height: $img.height()
        });
        this.model.on('change', console.log.bind(console));
        this.model.on('change:width change:height', this.updateObjectScale, this);
    },

    render: function(data) {
        this.$el.html('<img src="' + data.projectionValue + '">');
        this.$el.css({ left: data.position.left, top: data.position.top });
    },

    updateObjectScale: function(model) {
        console.log('????');
        this.$el.find('img')
            .css({
                width: model.get('width'),
                height: model.get('height')
            });
    }
});
function parent() {
    this.name = 'parent';
}

parent.prototype.getName = function() { return this.name; }

function child() {}
