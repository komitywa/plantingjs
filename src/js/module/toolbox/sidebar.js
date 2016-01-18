import underscore from 'underscore';
import jquery from 'jquery';
import { View } from '../../core';
import ToolboxViewObject from './object';
import ToolboxCollection from './collection';
import Const from '../../const';

const ToolboxViewSidebar = View.extend({
  className: 'plantingjs-toolbox',
  template: require('./sidebar.hbs'),

  initialize: function initialize() {
    const objectsIds = underscore.range(this.manifesto().getCopy('toolboxobjects').length);
    const objectsProjs = underscore.map(this.manifesto().getCopy('toolboxobjects'), function(object) {
      return object.projections;
    });
    const objectsData = underscore.zip(objectsIds, objectsProjs);

    this.collection = new ToolboxCollection(underscore.map(objectsData, function(objectData) {
      return {
        objectId: objectData[0],
        projections: objectData[1],
        currentProjection: 0,
      };
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

  hide: function hide() {
    this.$el.hide();
  },

  show() {
    this.$el.show();
  },
});

module.exports = ToolboxViewSidebar;
