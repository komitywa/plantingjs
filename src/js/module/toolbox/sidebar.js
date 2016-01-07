import { chain, range, map } from 'underscore';
import jquery from 'jquery';
import { View, Collection } from 'core';
// import ToolboxObject from './sidebar-object';
import ToolboxModel from '../plant/model';
import template from './sidebar.hbs';
import { Event } from 'const';

export default View.extend({
  className: 'plantingjs-toolbox',
  events: {
    'dragstart .plantingjs-toolboxobject-draggable': 'onDragStart',
  },

  initialize() {
    const objectsIds = range(this.manifesto().getCopy('toolboxobjects').length);
    const objectsProjs = map(this.manifesto().getCopy('toolboxobjects'), ({ projections }) => projections);
    const objectsData = chain(objectsIds)
      .zip(objectsProjs)
      .map(([ objectId, projections ]) => ({ objectId, projections, currentProjection: 0 }))
      .value();

    this.collection = new Collection(objectsData, {
      model: ToolboxModel,
      app: this.app,
    });
    this.render();
    this.app.on(Event.START_PLANTING, () => {
      this.$el.show();
    });
  },

  render() {
    let objects = this.collection.map((model) => {
      const {
        projections: [image],
        objectId,
      } = model.attributes;
      const cid = model.cid;

      return { image, objectId, cid };
    });

    objects = objects.concat(objects, objects, objects);
    this.$el.html(template({ objects }));
    this.makeObjectsDraggable();
  },

  hide() {
    this.$el.hide();
  },

  show() {
    this.$el.show();
  },

  makeObjectsDraggable() {
    const config = {
      containment: '.plantingjs-overlay',
      helper: 'clone',
      appendTo: '.plantingjs-overlay',
      zIndex: 1000,
    };

    this.$el.find('.plantingjs-toolboxobject-draggable')
      .draggable(config);
  },

  onDragStart(el) {
    const $el = jquery(el.currentTarget);
    const cid = $el.data('cid');
    const model = this.collection.get(cid).clone();

    $el.data('model', model.toJSON());
  },
});
