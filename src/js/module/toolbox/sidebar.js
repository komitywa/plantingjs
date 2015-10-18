var _ = require('underscore');
var $ = require('jquery');
var Planting = require('planting');
var Core = require('core');
var ToolboxViewObject = require('./object');
var ToolboxCollection = require('./collection');

var ToolboxViewSidebar = Core.View.extend({
    className: 'plantingjs-toolbox',
    template: _.template('\
        <div class="plantingjs-toolbox-toggle"></div>\
        <div class="plantingjs-savebtn">SAVE</div>\
        <div class="plantingjs-toolboxobject-container"></div>\
    '),
    events: {
        'click .plantingjs-savebtn': 'onSave'
    },

    initialize: function(obj) {
        var objectsIds = _.range(this.manifesto().getCopy('toolboxobjects').length);

        this.collection = new ToolboxCollection(_.map(objectsIds, function(objectId) {
            return {
                objectId: objectId
            };
        }), {
            app: this.app
        });
        this.objects = this.collection.map(function(toolboxObjectModel) {

            return new ToolboxViewObject({
                model: toolboxObjectModel,
                app: this.app
            });
        }, this);
        this.app.on(Planting.Event.START_PLANTING, function(visible) {
            this.$el.show();
        }, this);
        this.render( this.objects );
    },

    render: function( objects ) {
        var $template = $('<div />').append(this.template());
        var $list = $template.find('.plantingjs-toolboxobject-container');

        objects.forEach(function(object) {
            $list.append(object.$el);
        });
        this.$el.append($template);
    },

    onSave: function() {
        this.session()
            .save();
    },

    hide: function() {
        this.$el.hide();
    }
});
module.exports = ToolboxViewSidebar;
