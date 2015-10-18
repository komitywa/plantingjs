var _ = require('underscore');
var Core = require('core');
var LayersManagerViewItem = require('./menu-item');

var LayersManagerViewMenu = Core.View.extend({
    className: 'layers-menu',
    items: [],

    initialize: function(options) {
        this.$parent = options.$parent;
        this.$parent.append(this.$el);
        this.collection.each(this.addItem);
        this.collection
            .on('add remove', this.manageVisibility, this)
            .on('add', this.addItem, this)
            .on('remove', this.removeItem, this);
    },

    manageVisibility: function() {

        this.$el.toggle(!!this.collection.length);
    },

    addItem: function(model) {

        var item = new LayersManagerViewItem({
            $parent: this.$el,
            model: model,
            collection: this.collection
        });

        this.items.push(item);
    },

    removeItem: function(model) {
        var viewIndex = _.findIndex(this.items, function(item) {

            return item.model.cid === model.cid;
        });
        var view = this.items[viewIndex];

        view.model = null;
        view.collection = null;
        view.$parent = null;
        view.remove();
        this.items.splice(viewIndex, 1);
    }
});
module.exports = LayersManagerViewMenu;
