import underscore from 'underscore';
import jquery from 'jquery';
import { View } from 'core';
import ToolboxViewObject from './object';
import ToolboxCollection from './collection';
import Const from 'const';

var ToolboxViewSidebar = View.extend({
    className: 'plantingjs-toolbox',
    template: underscore.template('\
        <div class="plantingjs-toolbox-toggle"></div>\
        <div class="plantingjs-savebtn">SAVE</div>\
        <div class="plantingjs-toolboxobject-container"></div>\
    '),
    events: {
        'click .plantingjs-savebtn': 'onSave'
    },

    initialize: function(obj) {
        var objectsIds = underscore.range(this.manifesto().getCopy('toolboxobjects').length);

        this.collection = new ToolboxCollection(underscore.map(objectsIds, function(objectId) {
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
        this.app.on(Const.Event.START_PLANTING, function(visible) {
            this.$el.show();
        }, this);
        this.render( this.objects );
    },

    render: function( objects ) {
        var $template = jquery('<div />').append(this.template());
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
