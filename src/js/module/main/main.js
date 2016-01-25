import { View } from '../../core';
import Const from '../../const';
import Button from '../component/button';

const IS_PLANTING_CLASS = 'plantingjs-is-planting';

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
    this.submit = new Button({
      modifier: 'finish-session',
      label: 'zrobione!',
      visible: false,
    });
    this.submit.on('click', this.onClickSubmit, this);
    this.$proxy = this.$el.children();
    this.$proxy.append(this.submit.$el);
    this.app
      .on(Const.Event.VISIBLE_CHANGED, (visible) => {
        if (this.app.getState() !== Const.State.VIEWER) {
          this.$el.find('.plantingjs-startbtn').toggle(visible);
        }
      })
      .on(Const.Event.START_PLANTING, () => {
        this.$el.find('.plantingjs-startbtn').hide();
        this.$el.toggleClass(IS_PLANTING_CLASS, true);
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

  startPlanting() {
    this.app.trigger(Const.Event.START_PLANTING);
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
