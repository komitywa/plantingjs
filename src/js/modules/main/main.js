import { View } from '../../core';
import Const from '../../const';
import { submitButton, selectButton, initButton } from './main-view-buttons';
import template from './main.hbs';
import { isFunction } from 'lodash';

const IS_PLANTING_CLASS = 'plantingjs-is-planting';
const MODAL_CLASS = 'plantingjs-modal';

function handleSelectPano() {
  const { onSelectPano } = this.app.options;
  const panoData = this.manifesto()
    .pick('lat', 'lng', 'pitch', 'heading', 'zoom');

  if (isFunction(onSelectPano)) {
    onSelectPano(panoData);
  } else {
    throw Error('onSelectPano must be a function');
  }
}

function handleInitPlanting() {
  this.app.trigger(Const.Event.START_PLANTING);
}

function handlePlantedObjectsChanged(model, collection) {
  if (this.app.getState() !== Const.State.VIEWER) {
    this.submit.model.set('visible', collection.length > 0);
  }
}

function handleMapVisibleChange(visible) {
  if (this.app.getState() !== Const.State.VIEWER) {
    this.start.model.set({ visible });
  }
}

function handleStartPlanting() {
  this.$el.toggleClass(IS_PLANTING_CLASS, true);
  this.start.model.set('visible', false);
}

function handleStateChange(state) {
  this.$el.attr('data-state', state);
}

function handleSubmit(event) {
  /**
   * @todo
   * Show submit popup. For now just save session.
   */
  event.preventDefault();
  this.session().save();
}

export default View.extend({
  className: 'plantingjs-proxy',

  initialize() {
    this.submit = submitButton({ click: handleSubmit }, this);
    this.session()
        .objects()
        .on('add remove', handlePlantedObjectsChanged, this);

    if (this.app.options.selectPanoMode) {
      this.start = selectButton({ click: handleSelectPano }, this);
    } else {
      this.start = initButton({ click: handleInitPlanting }, this);
    }

    this.app
        .on(Const.Event.VISIBLE_CHANGED, handleMapVisibleChange, this)
        .on(Const.Event.START_PLANTING, handleStartPlanting, this)
        .on(Const.Event.STATE_CHANGED, handleStateChange, this);
  },

  render() {
    this.$el
      .html(template())
      .append(this.submit.$el, this.start.$el);

    return this;
  },

  getModal() {
    return this.$el.find(`.${MODAL_CLASS}`);
  },
});
