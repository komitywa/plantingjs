(function(Core, LayersManager) {

    LayersManager.View.Menu = Core.View.extend({
        className: 'layers-menu',
        itemTemplate: _.template('\
            <div class="plantingjs-layer-item" data-cid="<%= cid %>">\
                <button class="plantingjs-layer-item-arrow js-dir-up">UP</button>\
                <button class="plantingjs-layer-item-down js-dir-down">DOWN</button>\
            </div>'),

        events: {
            'click .js-dir-down': 'moveDown',
            'click .js-dir-up': 'moveUp'
        },

        initialize: function(options) {
            this.$parent = options.$parent;
            this.$parent.append(this.$el);
            this.render();

            this.collection.each(this.addItem);
            this.collection
                .on('all', this.manageVisibility, this)
                .on('add sort remove', this.render, this)
                .on('sort', console.log.bind(console))
                .on('change:userActivity', this.highlightItem, this);
        },

        render: function() {
            console.log('render');
            this.$el.empty();
            this.collection
                .each(function(model) {
                    this.$el.append(this.itemTemplate({
                        cid: model.cid
                    }));
                }, this);
        },

        manageVisibility: function() {

            this.$el.toggle(!!this.collection.length);
        },

        moveUp: function(e) {
            var cid = e.target.parentNode.dataset.cid;

            this.collection.moveUp(this.collection.get(cid));
        },

        moveDown: function(e) {
            var cid = e.target.parentNode.dataset.cid;

            this.collection.moveDown(this.collection.get(cid));
        },

        highlightItem: function(model) {
            this.$el
                .children()
                .eq(model.get('order'))
                    .toggleClass('user-active', model.get('userActivity'));
        }
    });

}(Planting.module('core'), Planting.module('layersManager')));
