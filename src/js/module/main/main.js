import { View } from '../../core';
import Const from '../../const';
import Button from '../component/button';

const IS_PLANTING_CLASS = 'plantingjs-is-planting';

const MainViewMain = View.extend({
  toolbox: null,
  map: null,
  className: 'plantingjs-container',
  template: require('./main.hbs'),
  events: {
    'click .plantingjs-startbtn': 'startPlanting',
  },

  $proxy: null,

  initialize: function() {
    this.render();
    this.submit = new Button({
      defaults: {
        modifier: 'finish-session',
        label: 'zrobione!',
        visible: false,
      },
      app: this.app,
    });
    this.submit.delegateEvents({
      click: this.onClickSubmit,
    });
    this.$proxy = this.$el.children();
    this.$proxy.append(this.submit.$el);
    this.app
      .on(Const.Event.VISIBLE_CHANGED, function(visible) {
        if (this.app.getState() !== Const.State.VIEWER) {
          this.$el.find('.plantingjs-startbtn').toggle(visible);
        }
      }, this)
      .on(Const.Event.START_PLANTING, function() {
        this.$el.find('.plantingjs-startbtn').hide();
        this.$el.toggleClass(IS_PLANTING_CLASS, true);
        this.submit.model.set('visible', true);
      }, this)
      .on(Const.Event.STATE_CHANGED, function(state) {
        this.$el
          .children().attr('data-state', state);
      }, this);
  },

  render: function() {
    this.$el.html(this.template());
  },

  startPlanting: function() {
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

const Main = {
  View: {
    Main: MainViewMain,
  },
};

module.exports = Main;
