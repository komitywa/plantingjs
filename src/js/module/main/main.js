import { View } from '../../core';
import Const from '../../const';
import Button from '../component/button';

const IS_PLANTING_CLASS = 'plantingjs-is-planting';
const SUBMIT_BUTTON_INIT_VALUES = {
  modifier: 'finish-session',
  label: 'zrobione!',
  visible: false,
};
const START_BUTTON_INIT_VALUES = {
  modifier: 'start-button',
  label: 'start planting!',
  visible: false,
};

export default View.extend({
  toolbox: null,
  map: null,
  className: 'plantingjs-container',
  template: require('./main.hbs'),
  $proxy: null,

  constructor(...args) {
    this.submit = new Button(SUBMIT_BUTTON_INIT_VALUES);
    this.start = new Button(START_BUTTON_INIT_VALUES);
    View.call(this, ...args);
  },

  initialize() {
    this.render();
    this.submit.on('click', this.onClickSubmit, this);
    this.start.on('click', this.onClickStartButton, this);
    this.$proxy = this.$el.children();
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

  onClickStartButton() {
    this.app.options.onSelectPano('test');
    // this.app.trigger(Const.Event.START_PLANTING);
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
