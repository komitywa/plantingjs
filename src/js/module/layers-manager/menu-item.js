var _ = require('underscore');
var Core = require('core');

var LayersManagerViewItem = Core.View.extend({
    className: 'plantingjs-layer-item',
    template: _.template('\
        <div class="plantingjs-layer-col plantingjs-layer-info">\
            <span><%= cid %></span>\
        </div>\
        <div class="plantingjs-layer-col plantingjs-layer-arrows">\
            <button class="plantingjs-layer-item-up js-dir-up">UP</button>\
            <button class="plantingjs-layer-item-down js-dir-down">DOWN</button>\
        </div>\
    '),

    events: {
        'click .js-dir-down': 'moveDown',
        'click .js-dir-up': 'moveUp',
        'mouseover': 'setUserActivity',
        'mouseleave': 'unsetUserActivity'
    },
    $parent: null,

    initialize: function(options) {
        this.$parent = options.$parent;
        this.render(this.model);
        this.model
            .on('change:userActivity', function(model, userActivity) {
                this.$el.toggleClass('user-active', userActivity);
            }, this)
            .on('change:layerIndex', this.reindex, this);
    },

    render: function(model) {
        this.$el.html(this.template({
            cid: model.cid
        }));
        this.$parent.append(this.$el);
    },

    moveUp: function() {
        var layerIndex = this.model.get('layerIndex');

        this.collection.moveLayer(layerIndex + 1, layerIndex);
    },

    moveDown: function() {
        var layerIndex = this.model.get('layerIndex');

        this.collection.moveLayer(layerIndex - 1, layerIndex);
    },

    reindex: function(model) {
        var index = model.get('layerIndex');
        var el = this.$parent
            .children()
                .eq(index).after(this.$el);
    },

    setUserActivity: function() {

        this.model.set('userActivity', true);
    },

    unsetUserActivity: function() {

        this.model.set('userActivity', false);
    }
});
module.exports = LayersManagerViewItem;
