import underscore from 'underscore';
import jquery from 'jquery';
import Core from 'core';
import ToolboxViewObject from './object';
import ToolboxCollection from './collection';
import Const from 'const';

const ToolboxViewSidebar = Core.View.extend({
  className: 'plantingjs-toolbox',
  template: underscore.template('\n' +
      '<div class="plantingjs-toolbox-toggle"></div>\n' +
      '<div class="plantingjs-savebtn">SAVE</div>\n' +
      '<div class="plantingjs-toolboxobject-container"></div>\n' +
  ''),
  events: {
    'click .plantingjs-savebtn': 'onSave',
  },

  initialize: function initialize() {
    const objectsIds = underscore.range(this.manifesto().getCopy('toolboxobjects').length);

    this.collection = new ToolboxCollection(underscore.map(objectsIds, function(objectId) {
      return {objectId: objectId};
    }), {app: this.app});
    this.objects = this.collection.map(function(toolboxObjectModel) {
      return new ToolboxViewObject({
        model: toolboxObjectModel,
        app: this.app,
      });
    }, this);
    this.app.on(Const.Event.START_PLANTING, function() {
      this.$el.show();
    }, this);
    this.render( this.objects );
  },

  render: function render(objects) {
    const $template = jquery('<div />').append(this.template());
    const $list = $template.find('.plantingjs-toolboxobject-container');

    objects.forEach(function(object) {
      $list.append(object.$el);
    });
    this.$el.append($template);
  },

  onSave: function onSave() {
    this.session()
      .save();
  },

  hide: function hide() {
    this.$el.hide();
  },
});

module.exports = ToolboxViewSidebar;
