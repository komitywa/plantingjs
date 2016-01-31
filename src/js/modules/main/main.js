import { View } from '../../core';
import Const from '../../const';
import Button from '../component/button';
import { isFunction } from 'underscore';


const IS_PLANTING_CLASS = 'plantingjs-is-planting';
const SUBMIT_BUTTON_INIT_VALUES = {
  modifier: 'finish-session',
  label: 'zrobione!',
  visible: false,
};
const START_BUTTON_INIT_VALUES = {
  modifier: 'start-planting-button',
  label: 'start planting!',
  visible: false,
};
const SELECT_PANO_INIT_VALUES = {
  modifier: 'select-pano-button',
  label: 'wybierz',
  visible: false,
};

export default View.extend({
  toolbox: null,
  map: null,
  className: 'plantingjs-container',
  template: require('./main.hbs'),
  events: {
    'click .plantingjs-startbtn': 'startPlanting',
  },
  $proxy: null,

  initialize() {
    this.render();
    this.$proxy = this.$el.children();
    this.submit = new Button(SUBMIT_BUTTON_INIT_VALUES);
    this.submit.on('click', this.onClickSubmit, this);

    const { selectPanoMode } = this.app.options;

    if (selectPanoMode) {
      this.start = new Button(SELECT_PANO_INIT_VALUES);
      this.start.on('click', () => {
        const { onSelectPano } = this.app.options;
        const panoData = this.manifesto()
          .pick('lat', 'lng', 'pitch', 'heading');

        if (isFunction(onSelectPano)) {
          onSelectPano(panoData);
        } else {
          throw Error('onSelectPano must be a function');
        }
      });
    } else {
      this.start = new Button(START_BUTTON_INIT_VALUES);
      this.start.on('click', () => {
        this.app.trigger(Const.Event.START_PLANTING);
      });
    }

    this.$proxy.append(this.submit.$el, this.start.$el);
    this.app
      .on(Const.Event.VISIBLE_CHANGED, (visible) => {
        if (this.app.getState() !== Const.State.VIEWER) {
          this.start.model.set({ visible });
        }
      })
      .on(Const.Event.START_PLANTING, () => {
        this.$el.toggleClass(IS_PLANTING_CLASS, true);
        this.start.model.set('visible', false);
        this.submit.model.set('visible', true);
      })
      .on(Const.Event.STATE_CHANGED, (state) => {
        this.$el
          .children().attr('data-state', state);
      });
  },

  render() {
    this.$el.html(this.template());
  },

  onClickSubmit(event) {
    /**
     * @todo
     * Show submit popup. For now just save session.
     */
    event.preventDefault();
    this.session().save();
  },
});
