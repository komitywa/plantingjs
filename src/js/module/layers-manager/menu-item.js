(function(Core, LayersManager) {

    LayersManager.View.Item = Core.View.extend({
        template: _.template('\
            <div class="plantingjs-layer-item">\
                <button class="plantingjs-layer-item-arrow js">UP</button>\
                <button class="plantingjs-layer-item-down js-dir-down">DOWN</button>\
            </div>'),
        $parent: null,

        events: {
            'click button': 'onClick'
        },

        initialize: function(options) {
            this.$parent = options.$parent;
            this.render(this.model);
            console.log(this);
        },

        render: function(model) {
            this.$el.html(this.template());
        },

        onClick: function(e) {
            console.log('clicked', e);
        },

        moveUp: function() {
            console.log('up');
            this.model.collection.moveUp(this.model);
        },

        moveDown: function() {

            console.log('down');
            this.model.collection.moveDown(this.model);
        }
    });

}(Planting.module('core'), Planting.module('layersManager')));
