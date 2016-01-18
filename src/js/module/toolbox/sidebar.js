import { chain, range } from 'underscore';
import jquery from 'jquery';
import { Collection, View } from '../../core';
import ToolboxModel from '../plant/model';
import template from './sidebar.hbs';
import { Event } from '../../const';


const USER_ACTIVE_CLASS = 'plantingjs-is-user-active';
const ACTIVITY_TIMEOUT_VALUE = 1500;


export default View.extend({
  className: 'plantingjs-toolbox',
  events: {
    'dragstart .plantingjs-js-draggable-object': 'onDragStart',
    'mouseenter': 'onMouseEnter',
    'mouseleave': 'onMouseLeave',
  },
  userActivityTimeout: null,
  mouseOver: false,

  initialize() {
    const objectsIds = range(this.manifesto().getCopy('toolboxobjects').length);
    const objectsProjs = this.manifesto()
      .getCopy('toolboxobjects')
      .map(({ projections }) => projections);
    const objectsData = chain(objectsIds)
      .zip(objectsProjs)
      .map(([ objectId, projections ]) => (
        { objectId, projections, currentProjection: 0 }))
      .value();

    this.collection = new Collection(objectsData, {
      model: ToolboxModel,
      app: this.app,
    });
    this.render();
    this.app.on(Event.START_PLANTING, () => {
      this.renewUserActivity(ACTIVITY_TIMEOUT_VALUE * 2);
    });
  },

  render() {
    const objects = this.collection.map((model) => {
      const {
        projections: [image],
        objectId,
      } = model.attributes;
      const cid = model.cid;

      return { image, objectId, cid };
    });

    this.$el.html(template({ objects }));
    this.makeObjectsDraggable();
  },

  makeObjectsDraggable() {
    const config = {
      containment: '.plantingjs-overlay',
      helper: 'clone',
      appendTo: '.plantingjs-overlay',
      zIndex: 10000,
    };

    this.$el.find('.plantingjs-js-draggable-object')
      .draggable(config);
  },

  onDragStart(el) {
    const $el = jquery(el.currentTarget);
    const cid = $el.data('cid');
    const model = this.collection.get(cid).clone();

    $el.data('model', model.toJSON());
  },

  onMouseEnter() {
    this.mouseOver = true;
    this.renewUserActivity();
  },

  onMouseLeave() {
    this.mouseOver = false;
    this.renewUserActivity();
  },

  renewUserActivity(timeout = ACTIVITY_TIMEOUT_VALUE) {
    this.$el.toggleClass(USER_ACTIVE_CLASS, true);
    clearTimeout(this.userActivityTimeout);
    this.userActivityTimeout = setTimeout(() => {
      if (this.mouseOver) {
        this.renewUserActivity();
        return;
      }

      this.$el.toggleClass(USER_ACTIVE_CLASS, false);
    }, timeout);
  },
});
